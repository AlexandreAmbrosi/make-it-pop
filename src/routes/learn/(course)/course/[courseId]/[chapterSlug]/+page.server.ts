import { db } from '$lib/db/drizzle';
import { courses, courseChapters } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
    const { chapterSlug } = params;
    const { course, structure } = await parent(); // Get course and structure from layout

    // Fetch chapter by Slug AND CourseId (via relation or directly if we join)
    // Since slug might not be globally unique (e.g. 'intro'), we must filter by course.
    // But `courseChapters` has `courseId`.

    // Check if course exists (it should via parent)

    const chapter = await db.query.courseChapters.findFirst({
        where: and(
            eq(courseChapters.slug, chapterSlug),
            eq(courseChapters.courseId, course.id)
        )
    });

    if (!chapter) {
        throw error(404, 'Chapter not found');
    }

    const contentHtml = await marked(chapter.content || '');

    // Flatten chapters for pagination
    // Define type for structure item if possible, but any[] is fine for now as we infer from usage
    const allChapters = structure.flatMap((part: any) => part.chapters);

    const currentIndex = allChapters.findIndex((c: any) => c.id === chapter.id);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    return {
        chapter: {
            ...chapter,
            html: contentHtml
        },
        pagination: {
            prev: prevChapter,
            next: nextChapter
        }
    };
};
