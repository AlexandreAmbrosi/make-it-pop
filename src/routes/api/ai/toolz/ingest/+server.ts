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

            // 1b. Try OpenGraph.io API if key is present
            let ogImage = null;
            const ogApiKey = env.OPENGRAPH_APP_ID;

            if (ogApiKey) {
                try {
                    const encodedUrl = encodeURIComponent(url);
                    const ogResponse = await fetch(`https://opengraph.io/api/1.1/site/${encodedUrl}?app_id=${ogApiKey}`);
                    if (ogResponse.ok) {
                        const ogData = await ogResponse.json();
                        ogImage = ogData.hybridGraph?.image || ogData.openGraph?.image?.url || null;
                    }
                } catch (e) {
                    console.error('OpenGraph.io API failed:', e);
                }
            }

            // Fallback: Extract OG Image locally if API failed or no key
            if (!ogImage) {
                const ogImageMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:image|twitter:image)["']\s+content=["'](.*?)["']/i);
                ogImage = ogImageMatch ? ogImageMatch[1] : null;

                // Resolve relative URLs
                if (ogImage && !ogImage.startsWith('http')) {
                    try {
                        ogImage = new URL(ogImage, url).toString();
                    } catch (e) {
                        ogImage = null;
                    }
                }
            }

            // Extract body text
            pageText = `Title: ${title}\nDescription: ${metaDesc}\nOG Image: ${ogImage}\nContent: ${cleanHtml.replace(/<[^>]+>/g, ' ').slice(0, 15000)}`; // limit context
        } catch (fetchError) {
            console.error('Fetcher Error:', fetchError);
            return json({ error: 'Failed to access the provided URL. Please try entering details manually.' }, { status: 422 });
        }

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
            - "imageUrl": The best image URL found. Prioritize the "OG Image" provided in the content above. If none, look for a logo or main product shot in the content. Return null if no good image found.

            Return ONLY valid JSON.
        `;

        // Retry logic for 429 errors
        let result;
        const maxRetries = 3;
        for (let i = 0; i < maxRetries; i++) {
            try {
                result = await model.generateContent(prompt);
                break; // Success
            } catch (e: any) {
                if ((e.status === 429 || e.response?.status === 429) && i < maxRetries - 1) {
                    const delay = Math.pow(2, i) * 2000; // 2s, 4s, 8s
                    console.warn(`Gemini 429 Hit. Retrying in ${delay}ms...`);
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }
                throw e; // Rethrow if not 429 or retries exhausted
            }
        }

        if (!result) throw new Error('Failed to generate content after retries');

        const responseText = result.response.text();

        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(cleanedText);

        return json({ success: true, data: aiData });

    } catch (e) {
        console.error("AI Ingestion Error:", e);
        return json({ error: 'AI analysis failed' }, { status: 500 });
    }
}
