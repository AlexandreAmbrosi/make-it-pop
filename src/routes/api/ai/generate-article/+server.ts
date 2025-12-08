
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
    const { topic, url } = await request.json();

    if (!topic && !url) {
        return json({ error: 'Topic or URL is required' }, { status: 400 });
    }

    const apiKey = env.GOOGLE_AI_KEY;
    if (!apiKey) {
        return json({
            title: `The Future of ${topic || 'Technology'}`,
            slug: `future-of-${(topic || 'tech').toLowerCase().replace(/\s+/g, '-')}`,
            description: `An in-depth look at how ${topic || 'tech'} is changing the world.`,
            content: `# The Future of ${topic || 'Technology'}\n\nLorem ipsum dolor sit amet...`,
            author: 'AI Writer',
            imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60'
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Write a blog post about: "${topic || url}".
            Return ONLY a valid JSON object with:
            - title (string)
            - slug (kebab-case string)
            - description (string)
            - content (markdown string, at least 3 paragraphs with headers)
            - author (string, e.g. "AI Staff")
            
            Do not include markdown formatting like \`\`\`json.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let data;
        try {
            data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (e) {
            console.error('Failed to parse AI JSON', text);
            throw new Error('Invalid AI response format');
        }

        return json(data);

    } catch (e) {
        console.error('AI Gen Error:', e);
        return json({ error: 'AI generation failed' }, { status: 500 });
    }
};
