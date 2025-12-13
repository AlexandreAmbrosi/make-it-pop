
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// import { GenerateContent } from '$lib/ai/gemini'; 

// Basic Gemini Stub for now if $lib/ai/gemini is not robust
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
    const { topic } = await request.json();

    if (!topic) {
        return json({ error: 'Topic is required' }, { status: 400 });
    }

    // Initialize Gemini
    const apiKey = env.GOOGLE_AI_KEY;
    if (!apiKey) {
        console.error('GOOGLE_AI_KEY is missing');
        // Return mock data for dev if no key
        return json({
            title: `Mastering ${topic}`,
            slug: `${topic.toLowerCase().replace(/\s+/g, '-')}-masterclass`,
            description: `A comprehensive guide to ${topic}.`,
            domain: 'General',
            level: 'Beginner',
            duration: '4 weeks',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
            usps: [
                { icon: 'Zap', text: 'Fast paced' },
                { icon: 'Star', text: 'Expert led' }
            ]
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `
            Create a course structure for the topic: "${topic}".
            Return ONLY a valid JSON object with the following fields:
            - title (string)
            - slug (kebab-case string)
            - description (string, max 200 chars)
            - domain (string: Design, Development, Business, or Marketing)
            - level (string: Beginner, Intermediate, Advanced)
            - duration (string, e.g. "5 hours")
            - usps (array of objects with "icon" (string name like Zap, Star, User) and "text")
            
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
