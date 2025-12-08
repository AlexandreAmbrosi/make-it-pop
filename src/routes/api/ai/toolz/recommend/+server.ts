import { json, type RequestEvent } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { tools } from '$lib/db/schema';

export async function POST({ request }: RequestEvent) {
    try {
        const { query, mode } = await request.json();

        if (!query) {
            return json({ error: 'Query is required' }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_KEY || '');

        // 1. Fetch all tools to provide context
        const allTools = await db.select({
            id: tools.id,
            name: tools.name,
            shortDescription: tools.shortDescription,
            tags: tools.tags,
            pricing: tools.pricing
        }).from(tools);

        const toolsContext = allTools.map(t =>
            `- ID: ${t.id}\n  Name: ${t.name}\n  Desc: ${t.shortDescription}\n  Tags: ${t.tags?.join(', ')}\n  Pricing: ${t.pricing}`
        ).join('\n\n');

        // 2. Construct Prompt
        const prompt = `
            You are an expert digital tooling assistant. 
            User Query: "${query}"

            Here is the list of available tools in our database:
            ${toolsContext}

            Analyze the tools and categorize them:
            1. STRICT matches: Tools that directly answer the user's specific request.
            2. RELATED matches: Tools that are relevant alternatives or in the same domain, to be used ONLY if no strict matches exist.

            Return a valid JSON object with:
            - "strictToolIds": [IDs of strict matches]
            - "relatedToolIds": [IDs of related matches]
            - "message": "If strict matches found: Explain why they fit. If ONLY related matches found: 'I couldn't find an exact match for that, but you might like these related tools because...'."

            Return ONLY valid JSON.
        `;

        // 3. Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 4. Parse Response
        let aiData;
        try {
            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            aiData = JSON.parse(cleanedText);
        } catch (e) {
            console.error("AI JSON Parse Error:", responseText);
            return json({ error: 'AI response malformed' }, { status: 500 });
        }

        // 5. Select Tools
        const fullTools = await db.select().from(tools);
        let recommendedTools: typeof fullTools = [];

        // Priority to strict matches
        if (aiData.strictToolIds && aiData.strictToolIds.length > 0) {
            recommendedTools = fullTools.filter(t => aiData.strictToolIds.includes(t.id));
        } else if (aiData.relatedToolIds && aiData.relatedToolIds.length > 0) {
            // Fallback to related
            recommendedTools = fullTools.filter(t => aiData.relatedToolIds.includes(t.id));
        }

        return json({
            message: aiData.message || "Here are the tools I found for you.",
            tools: recommendedTools
        });

    } catch (e) {
        console.error("Toolz AI Error:", e);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
