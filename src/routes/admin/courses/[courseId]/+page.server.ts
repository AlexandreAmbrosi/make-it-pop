import { db } from '$lib/db/drizzle';
import { courses, courseParts, courseChapters } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq, asc } from 'drizzle-orm';

export const load = async ({ params }) => {
    const { courseId } = params;

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId)
    });

    if (!course) {
        throw error(404, 'Course not found');
    }

    // Fetch parts (Chapters in UI) and chapters (Lessons in UI) manually or via relations if set up perfectly
    // Manual fetch ensures control over ordering
    const parts = await db
        .select()
        .from(courseParts)
        .where(eq(courseParts.courseId, courseId))
        .orderBy(asc(courseParts.order));

    const lessons = await db
        .select()
        .from(courseChapters)
        .where(eq(courseChapters.courseId, courseId))
        .orderBy(asc(courseChapters.order));

    return {
        course,
        parts,
        lessons
    };
};

export const actions = {
    updateMetadata: async ({ request, params }) => {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        // const isPublished = formData.get('isPublished') === 'on'; 

        await db
            .update(courses)
            .set({
                title,
                slug,
                description,
                // isPublished
            })
            .where(eq(courses.id, params.courseId));

        return { success: true };
    },
    // We will likely implement specific API routes for drag/drop structure updates to avoid full page reloads
};
