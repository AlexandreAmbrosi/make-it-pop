import { db } from '$lib/db/drizzle';
import { courseChapters } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function PUT({ request, params }) {
    const { content, title } = await request.json();
    const { lessonId } = params;

    const updateData: any = { updatedAt: new Date() };
    if (content !== undefined) {
        // SAFEGUARD: Strip known corrupted content (CoursePopup source code)
        // This prevents the recursion where saving a lesson causing it to include the popup layout code.
        const corruptedPattern = /&lt;div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true"&gt;[\s\S]*?&lt;\/div&gt;/g;
        // Also check for unescaped version just in case
        const corruptedPatternUnescaped = /<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">[\s\S]*?<\/div>/g;

        // Remove the specific Svelte if block signature often found in the corruption
        const svelteBlockPattern = /#if isOpen && course}[\s\S]*?{\/if}/g;

        let cleanContent = content
            .replace(corruptedPattern, '')
            .replace(corruptedPatternUnescaped, '')
            .replace(svelteBlockPattern, '');

        updateData.content = cleanContent;
    }
    if (title !== undefined) updateData.title = title;

    const [updated] = await db
        .update(courseChapters)
        .set(updateData)
        .where(eq(courseChapters.id, lessonId))
        .returning();

    return json(updated);
}
