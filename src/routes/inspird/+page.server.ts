import { db } from '$lib/db/drizzle';

import { inspirations } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Basic fetch all active inspirations
    const data = await db.select().from(inspirations)
        .where(eq(inspirations.isActive, true))
        .orderBy(desc(inspirations.createdAt));

    return {
        inspirations: data
    };
};
