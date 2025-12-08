
import { db } from '$lib/db/drizzle';
import { courses } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    if (params.id === 'new') {
        return { course: null };
    }

    const [course] = await db.select().from(courses).where(eq(courses.id, params.id)).limit(1);

    if (!course) {
        throw redirect(302, '/admin/learn');
    }

    return { course };
};

export const actions: Actions = {
    save: async ({ request, params }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const slug = data.get('slug') as string;
        const domain = data.get('domain') as string;
        const level = data.get('level') as string;
        const duration = data.get('duration') as string;
        const thumbnailUrl = data.get('thumbnailUrl') as string;
        const description = data.get('description') as string;
        const isPublished = data.get('isPublished') === 'on';

        if (!title || !slug) {
            return fail(400, { missing: true });
        }

        try {
            if (params.id === 'new') {
                await db.insert(courses).values({
                    title,
                    slug,
                    domain,
                    level,
                    duration,
                    thumbnailUrl,
                    description,
                    isPublished
                });
            } else {
                await db.update(courses).set({
                    title,
                    slug,
                    domain,
                    level,
                    duration,
                    thumbnailUrl,
                    description,
                    isPublished,
                    updatedAt: new Date()
                }).where(eq(courses.id, params.id));
            }
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Database error' });
        }

        throw redirect(303, '/admin/learn');
    }
};
