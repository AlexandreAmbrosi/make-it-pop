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

    /* 
       Note: Filtering by array 'tags' in Drizzle/Postgres can be complex with simple operators.
       For now, we'll fetch active tools and let the UI filter or implement proper array overlap later.
       If we want to strictly filter by category on server:
       // filters.push(sql`${tools.tags} @> ARRAY[${category}]`);
    */

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
