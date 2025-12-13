
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const unsplashKey = env.UNSPLASH_ACCESS_KEY
        const youtubeKey = env.YOUTUBE_API_KEY
        const searchTerm = topic || url || 'technology';

        const prompt = `
            Write a blog post about: "${searchTerm}".
            Return ONLY a valid JSON object with:
            - title (string)
            - slug (kebab-case string)
            - description (string)
            - content (markdown string, at least 3 paragraphs with headers)
            - author (string, e.g. "AI Staff")
            
            Do not include markdown formatting like \`\`\`json.
        `;

        // Run AI + Media Fetches in Parallel
        const [result, imageResult, videoResult] = await Promise.all([
            model.generateContent(prompt),
            fetchUnsplashImage(searchTerm, unsplashKey),
            fetchYouTubeVideo(searchTerm, youtubeKey)
        ])

        const text = result.response.text();

        let data;
        try {
            data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch (e) {
            console.error('Failed to parse AI JSON', text);
            throw new Error('Invalid AI response format');
        }

        // Inject Media
        if (imageResult) {
            data.imageUrl = imageResult
        } else if (!data.imageUrl) {
            data.imageUrl = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60'
        }

        if (videoResult) {
            data.content += `\n\n## Related Video\n\n${videoResult}`
        }

        return json(data);

    } catch (e) {
        console.error('AI Gen Error:', e);
        return json({ error: 'AI generation failed' }, { status: 500 });
    }
};

async function fetchUnsplashImage(query: string, accessKey: string | undefined) {
    if (!accessKey) return null
    try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: { Authorization: `Client-ID ${accessKey}` }
        })
        const data = await res.json()
        return data.results?.[0]?.urls?.regular || null
    } catch {
        return null
    }
}

async function fetchYouTubeVideo(query: string, apiKey: string | undefined) {
    if (!apiKey) return null
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}&maxResults=1`)
        const data = await res.json()
        const videoId = data.items?.[0]?.id?.videoId
        if (!videoId) return null

        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        const url = `https://www.youtube.com/watch?v=${videoId}`
        return `[![Watch the video](${thumbnail})](${url})`
    } catch {
        return null
    }
}
