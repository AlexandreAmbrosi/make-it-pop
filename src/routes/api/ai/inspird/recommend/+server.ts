import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { query, mode } = await request.json();

        if (!query) {
            return json({ error: 'Query is required' }, { status: 400 });
        }

        // TODO: Integrate Gemini AI here
        console.log(`[AI Inspird] Generating inspiration for: ${query} (mode: ${mode})`);

        // Mock Response
        await new Promise(r => setTimeout(r, 1000));

        return json({
            message: `Here is some inspiration for "${query}" (Mocked AI Response)`,
            items: [
                { title: "Neon Concept", url: "#" },
                { title: "Minimalist layout", url: "#" }
            ]
        });
    } catch (e) {
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
