
import { db } from '$lib/db/drizzle';
import { articles } from '$lib/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
    return {
        articles: allArticles
    };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        if (!id) return { success: false };

        await db.delete(articles).where(eq(articles.id, id));
        return { success: true };
    },
    toggle: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const isPublished = data.get('isPublished') === 'true';

        await db.update(articles).set({ isPublished: !isPublished }).where(eq(articles.id, id));
        return { success: true };
    }
};
