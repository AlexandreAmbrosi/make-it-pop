import { json, type RequestEvent } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

export async function POST({ request }: RequestEvent) {
    try {
        const { url } = await request.json();

        if (!url) {
            return json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Fetch Page Content
        let pageText = '';
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; MakeItPopBot/1.0; +http://makeitpop.app)'
                }
            });
            if (!res.ok) throw new Error(`Failed to fetch ${url}`);
            const html = await res.text();

            // Simple strip tags (regex is fragile but sufficient for MVP context injection)
            // We focus on title, meta description, and body content
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1] : '';

            const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
            const metaDesc = metaDescMatch ? metaDescMatch[1] : '';

            // Remove scripts and styles
            let cleanHtml = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");

            // Extract body text
            pageText = `Title: ${title}\nDescription: ${metaDesc}\nContent: ${cleanHtml.replace(/<[^>]+>/g, ' ').slice(0, 15000)}`; // limit context
        } catch (fetchError) {
            console.error('Fetcher Error:', fetchError);
            return json({ error: 'Failed to access the provided URL. Please try entering details manually.' }, { status: 422 });
        }

        // 2. Generate Smart Screenshot URL
        // We use Microlink's free tier for high-quality screenshots. 
        // options: screenshot=true, meta=false, embed=screenshot.url ensures we get the raw image link if possible, 
        // but for robustness we construct the API url that SERVES the image.
        const encodedUrl = encodeURIComponent(url);
        const screenshotUrl = `https://api.microlink.io?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url`;

        // 3. Call Gemini
        const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            Analyze this webpage content for a digital tool/SaaS.
            
            URL: ${url}
            Page Content:
            ${pageText}

            Extract the following details into a valid JSON object:
            - "name": The clear name of the tool.
            - "shortDescription": A punchy, 1-sentence marketing description (max 100 chars).
            - "pricing": One of ["Free", "Freemium", "Paid", "Contact"].
            - "tags": An array of 3-5 relevant functional tags (e.g. "Design", "Database", "AI").
            - "imageUrl": "${screenshotUrl}" (Always use this screenshot URL I provided).

            Return ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(cleanedText);

        // Force the screenshot URL if Gemini somehow missed it, though prompt instruction is strong.
        if (!aiData.imageUrl || aiData.imageUrl === 'null') {
            aiData.imageUrl = screenshotUrl;
        }

        return json({ success: true, data: aiData });

    } catch (e) {
        console.error("AI Ingestion Error:", e);
        return json({ error: 'AI analysis failed' }, { status: 500 });
    }
}
