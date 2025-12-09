import { db } from '$lib/db/drizzle';
import { tools } from '$lib/db/schema';
import { desc, ilike, or, and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q');
    const category = url.searchParams.get('category');

    let filters = [];

    // Filter by Active
    filters.push(eq(tools.isActive, true));

    if (query) {
        filters.push(or(
            ilike(tools.name, `%${query}%`),
            ilike(tools.shortDescription, `%${query}%`)
        ));
    }

    if (category && category !== 'All') {
        filters.push(eq(tools.type, category));
    }

    try {
        const data = await db.select().from(tools)
            .where(and(...filters))
            .orderBy(desc(tools.createdAt));

        return {
            tools: data
        };
    } catch (e) {
        console.error('Toolz Load Error:', e);
        return { tools: [] };
    }
};
