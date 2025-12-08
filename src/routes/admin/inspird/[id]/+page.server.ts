
import { db } from '$lib/db/drizzle';
import { inspirations } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    if (params.id === 'new') {
        return { item: null };
    }

    const [item] = await db.select().from(inspirations).where(eq(inspirations.id, params.id)).limit(1);

    if (!item) {
        throw redirect(302, '/admin/inspird');
    }

    return { item };
};

export const actions: Actions = {
    save: async ({ request, params }) => {
        const data = await request.formData();
        const creatorName = data.get('creatorName') as string;
        const resourceUrl = data.get('resourceUrl') as string;
        const thumbnailUrl = data.get('thumbnailUrl') as string;
        const tagsRaw = data.get('tags') as string;
        const isActive = data.get('isActive') === 'on';

        if (!resourceUrl) {
            return fail(400, { missing: true });
        }

        const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

        try {
            if (params.id === 'new') {
                await db.insert(inspirations).values({
                    creatorName,
                    resourceUrl,
                    thumbnailUrl,
                    tags,
                    isActive,
                    projectDate: new Date()
                });
            } else {
                await db.update(inspirations).set({
                    creatorName,
                    resourceUrl,
                    thumbnailUrl,
                    tags,
                    isActive,
                    updatedAt: new Date()
                }).where(eq(inspirations.id, params.id));
            }
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Database error' });
        }

        throw redirect(303, '/admin/inspird');
    }
};
