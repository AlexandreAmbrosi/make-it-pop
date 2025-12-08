
import { db } from '$lib/db/drizzle';
import { articles } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
    // Slug might be passed as array due to [...slug] or string
    // In SvelteKit [...slug] params.slug is a string "foo/bar"
    const slug = params.slug;

    const [article] = await db.select().from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

    if (!article) {
        throw error(404, 'Article not found');
    }

    // Render markdown on server
    const contentHtml = await marked.parse(article.content || '');

    return {
        article,
        contentHtml
    };
};
