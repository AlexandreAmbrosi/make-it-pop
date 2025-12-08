
import { db } from '$lib/db/drizzle';
import { articles } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const dbArticles = await db.select().from(articles)
            .where(eq(articles.isPublished, true))
            .orderBy(desc(articles.createdAt));

        return {
            articles: dbArticles
        };
    } catch (e) {
        console.error('Newz Logic Error:', e);
        // Return empty array to avoid crash
        return {
            articles: []
        };
    }
};
