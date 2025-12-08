import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { topic } = await request.json();

        if (!topic) {
            return json({ error: 'Topic is required' }, { status: 400 });
        }

        // TODO: Integrate Gemini AI here to generate article content
        console.log(`[AI Newz] Generating article for: ${topic}`);

        // Mock Response
        await new Promise(r => setTimeout(r, 1500));

        return json({
            title: `The Future of ${topic}`,
            slug: `future-of-${topic.toLowerCase().replace(/\s+/g, '-')}`,
            content: `<h1>The Future of ${topic}</h1><p>This is a generated article about ${topic}...</p>`,
            excerpt: `A deep dive into ${topic}.`
        });
    } catch (e) {
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
