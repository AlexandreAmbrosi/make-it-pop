
import { db } from '$lib/db/drizzle';
import { tools } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    if (params.id === 'new') {
        return { tool: null };
    }

    const [tool] = await db.select().from(tools).where(eq(tools.id, params.id)).limit(1);

    if (!tool) {
        // handle 404 or redirect
        throw redirect(302, '/admin/toolz');
    }

    return { tool };
};

export const actions: Actions = {
    save: async ({ request, params }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const url = data.get('url') as string;
        const shortDescription = data.get('shortDescription') as string;
        const imageUrl = data.get('imageUrl') as string;
        const pricing = data.get('pricing') as string;
        const tagsRaw = data.get('tags') as string;
        const isActive = data.get('isActive') === 'on';

        if (!name || !url) {
            return fail(400, { missing: true });
        }

        const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

        try {
            if (params.id === 'new') {
                await db.insert(tools).values({
                    name,
                    url,
                    shortDescription,
                    imageUrl,
                    pricing,
                    tags,
                    isActive
                });
            } else {
                await db.update(tools).set({
                    name,
                    url,
                    shortDescription,
                    imageUrl,
                    pricing,
                    tags,
                    isActive,
                    updatedAt: new Date()
                }).where(eq(tools.id, params.id));
            }
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Database error' });
        }

        throw redirect(303, '/admin/toolz');
    }
};
