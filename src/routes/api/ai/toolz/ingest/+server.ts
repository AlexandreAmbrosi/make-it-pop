import { json, type RequestEvent } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

export async function POST({ request }: RequestEvent) {
    try {
        const { url } = await request.json();

        if (!url) {
            return json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Fetch Page Metadata & Screenshot via Microlink
        let microlinkData = null;
        let finalImage = 'https://placehold.co/600x400?text=No+Image'; // Robust fallback
        let finalImageSource = 'placeholder'; // og | logo | screenshot | placeholder

        try {
            const encodedUrl = encodeURIComponent(url);
            // Requesting meta, screenshot, and using a generous timeout
            const microlinkRes = await fetch(`https://api.microlink.io/?url=${encodedUrl}&screenshot=true&meta=true&filter=image,screenshot,title,description,logo`);

            if (microlinkRes.ok) {
                const jsonRes = await microlinkRes.json();
                const { data } = jsonRes;

                microlinkData = {
                    title: data.title,
                    description: data.description,
                    image: data.image?.url,
                    logo: data.logo?.url,
                    screenshot: data.screenshot?.url
                };

                // Priority Logic: Logo/Image -> Screenshot -> Placeholder
                if (microlinkData.image) {
                    finalImage = microlinkData.image;
                    finalImageSource = 'og';
                } else if (microlinkData.logo) {
                    finalImage = microlinkData.logo;
                    finalImageSource = 'logo';
                } else if (microlinkData.screenshot) {
                    finalImage = microlinkData.screenshot;
                    finalImageSource = 'screenshot';
                }
            }
        } catch (e) {
            console.error('Microlink Fetch failed:', e);
            // Fallback continues with default finalImage
        }

        // 2. Fetch Text Content for AI Context (Still useful for accurate description/tags)
        // We can do a quick text scrape or just rely on the meta description if scraping is flaky. 
        // For robustness, let's keep the lightweight fetch if possible, but don't fail hard if it breaks.
        let pageContext = "";
        try {
            const htmlRes = await fetch(url, { headers: { 'User-Agent': 'MakeItPopBot/1.0' } });
            if (htmlRes.ok) {
                const html = await htmlRes.text();
                // Very basic strip tags for context
                pageContext = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                    .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
                    .replace(/<[^>]+>/g, ' ').slice(0, 8000);
            }
        } catch (ignored) { }

        const contextText = `
            Title: ${microlinkData?.title || ''}
            Description: ${microlinkData?.description || ''}
            Context: ${pageContext}
            PRIORITY IMAGE URL: ${finalImage}
        `;

        // 3. Call Gemini
        const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            Analyze this digital tool/SaaS.
            
            URL: ${url}
            ${contextText}

            Extract details into JSON:
            - "name": Tool name.
            - "shortDescription": Punchy 1-sentence marketing text.
            - "pricing": ["Free", "Freemium", "Paid", "Contact"].
            - "type": ["Online Tool", "Web extension", "App/Software", "Plugin", "Resources", "AI Tool"].
            - "tags": Array of 3-5 tags.
            - "imageUrl": "${finalImage}" (ALWAYS use this exact URL provided as PRIORITY IMAGE URL).

            Return ONLY valid JSON.
        `;

        // Retry logic for 429
        let result;
        const maxRetries = 2;
        for (let i = 0; i < maxRetries; i++) {
            try {
                result = await model.generateContent(prompt);
                break;
            } catch (e: any) {
                if (e.status === 429 || e.response?.status === 429) {
                    await new Promise(r => setTimeout(r, 2000 * (i + 1)));
                    continue;
                }
                throw e;
            }
        }

        if (!result) throw new Error('Failed to generate content after retries');

        const responseText = result.response.text();

        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(cleanedText);

        // Inject source for frontend
        aiData.imageSource = finalImageSource;

        return json({ success: true, data: aiData });

    } catch (e: any) {
        console.error("AI Ingestion Error:", e);
        return json({ error: `AI analysis failed: ${e.message || e}` }, { status: 500 });
    }
}
