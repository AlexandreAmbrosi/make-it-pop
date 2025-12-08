
import { db } from '$lib/db/drizzle';
import { courses } from '$lib/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allCourses = await db.select().from(courses).orderBy(desc(courses.createdAt));
    return {
        courses: allCourses
    };
};
