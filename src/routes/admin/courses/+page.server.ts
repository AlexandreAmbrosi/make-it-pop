import { db } from '$lib/db/drizzle';
import { courses } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';


export const load = async () => {
    const allCourses = await db.select().from(courses).orderBy(desc(courses.createdAt));
    return {
        courses: allCourses
    };
};

export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const title = formData.get('title') as string;

        if (!title) {
            return fail(400, { missing: true });
        }

        // Simple slug generation
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Check if slug exists
        const existing = await db.select().from(courses).where(eq(courses.slug, slug));
        let finalSlug = slug;
        if (existing.length > 0) {
            finalSlug = `${slug}-${Date.now()}`;
        }

        const [newCourse] = await db
            .insert(courses)
            .values({
                title,
                slug: finalSlug,
                isPublished: false
            })
            .returning();

        throw redirect(303, `/admin/courses/${newCourse.id}`);
    }
};
