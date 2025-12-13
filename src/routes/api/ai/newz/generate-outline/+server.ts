import { json, type RequestEvent } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { articleDrafts } from '@/lib/db/schema';
import { isAdmin, ADMIN_EMAILS } from '$lib/utils/auth.server';
import { scrapeUrl } from '$lib/server/scraper';

export async function POST({ request, cookies, locals }: RequestEvent) {
    const session = await locals.auth();
    const isSessionAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

    if (!isAdmin(cookies, request) && !isSessionAdmin) {
        return json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { workingTitle, primaryKeyword, audience, tone, resources } = await request.json();

        // 1. Parse Resources for URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = resources.match(urlRegex) || [];

        let context = `
            User Notes / Raw Text:
            ${resources}
        `;

        // 2. Scrape URLs
        for (const url of urls) {
            const scrapedText = await scrapeUrl(url);
            if (scrapedText) {
                context += `
                    ---
                    Content from ${url}:
                    ${scrapedText}
                    ---
                `;
            }
        }

        // 3. Prompt Gemini
        const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

        const systemPrompt = `
            You are an expert SEO Content Strategist and Lead Editor.
            Your goal is to create a structured outline for a high-quality, long-form blog post that is human, organic, and visually rich.
            
            **Structure Strategy**:
            For news/trends, follow this flow:
            1. **The Hook**: Context + Stakes.
            2. **What Happened**: Concise facts.
            3. **Why It Matters**: Deep analysis.
            4. **The Impact**: Who is affected? (Designers, Founders, etc.)
            5. **Examples/Case Studies**: Real world application.
            6. **Practical Takeaways**: Actionable advice.
            7. **FAQ**: 3-5 relevant questions.
            8. **Conclusion**: Final thought.
            
            ADAPT this structure if the content demands it. Do not be rigid if the topic suggests a different flow.
            You must return a valid JSON object.
        `;

        const userPrompt = `
            Primary Keyword: ${primaryKeyword}
            Target Audience: ${audience}
            Tone: ${tone}
            Working Title Idea: ${workingTitle || 'None provided'}

            Context/Research Materials:
            ${context.slice(0, 30000)} 

            Please generate a JSON object with the following structure:
            {
                "titleOptions": ["Catchy Title 1", "SEO Title 2", "Viral Title 3"],
                "recommendedSlug": "keyword-based-slug",
                "metaDescription": "Compelling description (max 160 chars)",
                "outline": [
                    {
                        "heading": "Section Heading",
                        "points": ["Key point to cover", "Another angle", "Transition idea"],
                        "subsections": [ // optional
                            { "heading": "Subheader", "points": ["..."] }
                        ]
                    }
                ],
                "faq": [
                    { "question": "Q1?", "answer": "Brief answer hint" }
                ],
                "suggestedTags": ["tag1", "tag2"],
                "categorySuggestion": "Category Name"
            }
            
            Ensure the outline flows naturally like a story.
            Return ONLY valid JSON.
        `;

        const result = await model.generateContent([systemPrompt, userPrompt]);
        const responseText = result.response.text();

        // Robust JSON cleaning: extract only the JSON part
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const cleanedText = jsonMatch ? jsonMatch[0] : responseText;

        let aiData;
        try {
            aiData = JSON.parse(cleanedText);
        } catch (initialError) {
            console.error("JSON Parse 1 Failed:", initialError, cleanedText.slice(0, 100));
            // Fallback: simple strip if regex failed to capture correct block
            const simpleClean = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            aiData = JSON.parse(simpleClean);
        }

        // 4. Save Draft
        const [inserted] = await db.insert(articleDrafts).values({
            status: 'outline_generated',
            workingTitle: workingTitle,
            primaryKeyword: primaryKeyword,
            targetAudience: audience,
            tone: tone,
            rawResources: resources,
            outlineData: aiData,
        }).returning();

        return json({ success: true, draftId: inserted.id, data: aiData });

    } catch (e: any) {
        console.error("AI Outline Gen Error:", e);
        return json({ error: `Analysis failed: ${e.message || e}` }, { status: 500 });
    }
}
