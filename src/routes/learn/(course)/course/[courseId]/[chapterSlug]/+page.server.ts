import { db } from '$lib/db/drizzle';
import { courseChapters, courses } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { courseId, chapterSlug } = params;

    try {
        // 1. Validate Course exists
        const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);

        if (!course) throw error(404, 'Course not found');

        // 2. Fetch the specific chapter
        const [chapter] = await db.select().from(courseChapters)
            .where(and(
                eq(courseChapters.courseId, courseId),
                eq(courseChapters.slug, chapterSlug)
            ))
            .limit(1);

        if (!chapter) throw error(404, 'Chapter not found');

        return {
            chapter,
            course
        };
    } catch (e: any) {
        console.error('DB Error Load Chapter:', e);
        if (e?.status === 404) throw e;
        throw error(500, 'Could not load chapter content.');
    }
};
