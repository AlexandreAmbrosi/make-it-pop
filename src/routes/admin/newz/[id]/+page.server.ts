
import { db } from '$lib/db/drizzle';
import { articles } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    if (params.id === 'new') {
        return { article: null };
    }

    const [article] = await db.select().from(articles).where(eq(articles.id, params.id)).limit(1);

    if (!article) {
        throw redirect(302, '/admin/newz');
    }

    return { article };
};

export const actions: Actions = {
    save: async ({ request, params }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const slug = data.get('slug') as string;
        const description = data.get('description') as string;
        const content = data.get('content') as string;
        const imageUrl = data.get('imageUrl') as string;
        const author = data.get('author') as string;
        const isPublished = data.get('isPublished') === 'on';

        if (!title || !slug) {
            return fail(400, { missing: true });
        }

        try {
            if (params.id === 'new') {
                await db.insert(articles).values({
                    title,
                    slug,
                    description,
                    content,
                    imageUrl,
                    author,
                    isPublished
                });
            } else {
                await db.update(articles).set({
                    title,
                    slug,
                    description,
                    content,
                    imageUrl,
                    author,
                    isPublished,
                    updatedAt: new Date()
                }).where(eq(articles.id, params.id));
            }
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Database error' });
        }

        throw redirect(303, '/admin/newz');
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        if (!id) return fail(400, { missing: true });

        try {
            await db.delete(articles).where(eq(articles.id, id));
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Database error' });
        }

        throw redirect(303, '/admin/newz');
    }
};
