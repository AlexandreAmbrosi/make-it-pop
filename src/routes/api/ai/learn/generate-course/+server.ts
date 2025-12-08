import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { topic, level } = await request.json();

        if (!topic) {
            return json({ error: 'Topic is required' }, { status: 400 });
        }

        // TODO: Integrate Gemini AI here to generate course structure
        console.log(`[AI Learn] Generating course for: ${topic} (${level})`);

        // Mock Response
        await new Promise(r => setTimeout(r, 2000));

        return json({
            title: `Mastering ${topic}`,
            slug: `mastering-${topic.toLowerCase().replace(/\s+/g, '-')}`,
            description: `A complete guide to ${topic} for ${level} level students.`,
            parts: [
                {
                    title: "Part 1: The Basics",
                    slug: "basics",
                    chapters: [
                        { title: "Introduction", slug: "intro", content: "# Intro..." },
                        { title: "Setup", slug: "setup", content: "# Setup..." }
                    ]
                }
            ]
        });
    } catch (e) {
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
