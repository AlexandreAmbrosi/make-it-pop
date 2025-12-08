
import { db } from '$lib/db/drizzle';
import { inspirations } from '$lib/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    const allInspo = await db.select().from(inspirations).orderBy(desc(inspirations.createdAt));
    return {
        inspirations: allInspo
    };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        if (!id) return { success: false };

        await db.delete(inspirations).where(eq(inspirations.id, id));
        return { success: true };
    },
    toggle: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const isActive = data.get('isActive') === 'true';

        await db.update(inspirations).set({ isActive: !isActive }).where(eq(inspirations.id, id));
        return { success: true };
    }
};
