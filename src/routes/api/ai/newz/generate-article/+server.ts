import { json, type RequestEvent } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { articleDrafts, articles } from '@/lib/db/schema';
import { isAdmin, ADMIN_EMAILS } from '$lib/utils/auth.server';
import { getUnsplashImage, getYouTubeVideo } from '$lib/server/media';
import { eq } from 'drizzle-orm';

export async function POST({ request, cookies, locals }: RequestEvent) {
    const session = await locals.auth();
    const isSessionAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

    if (!isAdmin(cookies, request) && !isSessionAdmin) {
        return json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { draftId, chosenTitle, chosenSlug } = await request.json();

        if (!draftId) return json({ error: 'Draft ID required' }, { status: 400 });

        // 1. Fetch Draft
        const [draft] = await db.select().from(articleDrafts).where(eq(articleDrafts.id, draftId));

        if (!draft) return json({ error: 'Draft not found' }, { status: 404 });

        // 2. Prepare Context
        const outlineStr = JSON.stringify(draft.outlineData, null, 2);

        // 3. Prompt Gemini
        const genAI = new GoogleGenerativeAI(env.GOOGLE_AI_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `
            You are a Senior Editor and Writer. You write in a human, organic, and engaging way.
            Your goal is to write a full article based on an outline, but you must TRANSEND the outline to create a smooth narrative.
            
            **Writing Style Rules**:
            - **Tone**: ${draft.tone} (Professional but conversational).
            - **Flow**: Avoid the robotic "Header -> Paragraph" loop. Use transitions between sections.
            - **Structure**: Vary paragraph lengths. Use short punchy sentences mixed with deeper analysis.
            - **Human Touches**: Occasionally use rhetorical questions (1-3 max). Use phrases like "Here’s the interesting part" or "Let’s break this down".
            - **No Clichés**: Avoid "In today's fast-paced world", "Conclusion", "As we all know".
            
            **Media Instructions**:
            - You must identify opportunities to embrace visual richness.
            - **Images**: When a visual would help (e.g. "UI screenshot", "Team photo", "Abstract concept"), write: 
              \`[[IMAGE: specific search query for the image]]\`
              (Example: \`[[IMAGE: smiling team working on laptops office]]\`)
            - **Videos**: If a specific topic, product launch, or tutorial is mentioned, write:
              \`[[VIDEO: specific youtube search query]]\`
              (Example: \`[[VIDEO: Figma Config 2024 highlights]]\`)
            - Place these tags on their own lines where they fit naturally.
        `;

        const userPrompt = `
            Title: ${chosenTitle || draft.workingTitle || 'Untitled'}
            Primary Keyword: ${draft.primaryKeyword}
            
            Outline:
            ${outlineStr}

            Raw Sources / Context:
            ${draft.rawResources?.slice(0, 50000)}

            **Instructions**:
            1. Write the full article body in clean Markdown.
            2. Start with a strong Hook/Intro (no "Introduction" header).
            3. Follow the outline logic but make it flow like a story.
            4. Insert \`[[IMAGE:...]]\` and \`[[VIDEO:...]]\` tags frequently (aim for 2-3 images and 1 video if relevant).
            5. End with a strong conclusion (no "Conclusion" header if possible, just natural ending) and then the FAQ section.
            
            Return ONLY the Markdown content.
        `;

        const result = await model.generateContent([systemPrompt, userPrompt]);
        const responseText = result.response.text();
        let cleanedMarkdown = responseText.replace(/^```markdown/, '').replace(/^```/, '').replace(/```$/, '').trim();

        // --- MEDIA ENRICHMENT ---
        // 1. Process Images
        const imageRegex = /\[\[IMAGE:\s*(.*?)\]\]/g;
        const imageMatches = [...cleanedMarkdown.matchAll(imageRegex)];

        for (const match of imageMatches) {
            const placeholder = match[0];
            const query = match[1];
            const image = await getUnsplashImage(query);

            if (image) {
                const credit = `\n\n<p class="text-xs text-gray-500 text-center italic">${image.credit}</p>`;
                const imgBlock = `![${image.alt}](${image.url}) ${credit}`;
                cleanedMarkdown = cleanedMarkdown.replace(placeholder, imgBlock);
            } else {
                // Fallback
                cleanedMarkdown = cleanedMarkdown.replace(placeholder, `![${query}](/images/placeholder.jpg)`);
            }
        }

        // 2. Process Videos
        const videoRegex = /\[\[VIDEO:\s*(.*?)\]\]/g;
        const videoMatches = [...cleanedMarkdown.matchAll(videoRegex)];

        for (const match of videoMatches) {
            const placeholder = match[0];
            const query = match[1];
            const video = await getYouTubeVideo(query);

            if (video) {
                const embed = `
<div class="video-container my-8">
  <iframe
    src="https://www.youtube.com/embed/${video.videoId}"
    loading="lazy"
    title="${video.title}"
    class="w-full aspect-video rounded-lg shadow-md"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>`;
                cleanedMarkdown = cleanedMarkdown.replace(placeholder, embed);
            } else {
                // Remove tag if no video found
                cleanedMarkdown = cleanedMarkdown.replace(placeholder, '');
            }
        }
        // ------------------------

        // 4. Create Article Record
        const [newArticle] = await db.insert(articles).values({
            title: chosenTitle || draft.workingTitle || 'Untitled Draft',
            slug: chosenSlug || `draft-${Date.now()}`,
            content: cleanedMarkdown,
            description: (draft.outlineData as any)?.metaDescription || '',
            author: 'Make It Pop AI',
            isPublished: false,
        }).returning();

        // 5. Update Draft Record
        await db.update(articleDrafts)
            .set({
                status: 'draft_created',
                articleId: newArticle.id
            })
            .where(eq(articleDrafts.id, draftId));

        return json({
            success: true,
            articleId: newArticle.id,
            markdown: cleanedMarkdown
        });

    } catch (e: any) {
        console.error("AI Article Gen Error:", e);
        return json({ error: `Generation failed: ${e.message || e}` }, { status: 500 });
    }
}
