import { db } from '$lib/db/drizzle';
import { courses } from '$lib/db/schema';
import { desc, eq, ilike, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q');

    let filters = [];
    filters.push(eq(courses.isPublished, true));

    if (query) {
        filters.push(ilike(courses.title, `%${query}%`));
    }

    try {
        const data = await db.select().from(courses)
            .where(and(...filters))
            .orderBy(desc(courses.createdAt));

        return {
            courses: data
        };
    } catch (e) {
        console.error('Courses Load Error:', e);
        return { courses: [] };
    }
};
