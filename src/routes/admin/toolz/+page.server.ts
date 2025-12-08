
import { db } from '$lib/db/drizzle';
import { tools } from '$lib/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    const allTools = await db.select().from(tools).orderBy(desc(tools.createdAt));
    return {
        tools: allTools
    };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        if (!id) return { success: false };

        await db.delete(tools).where(eq(tools.id, id));
        return { success: true };
    },
    toggle: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const isActive = data.get('isActive') === 'true';

        await db.update(tools).set({ isActive: !isActive }).where(eq(tools.id, id));
        return { success: true };
    }
};
