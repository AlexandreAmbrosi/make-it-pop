import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { ADMIN_EMAILS } from '$lib/utils/auth.server';

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = await locals.auth();

    if (!session?.user) {
        throw redirect(303, '/signin');
    }

    if (!session.user.email || !ADMIN_EMAILS.includes(session.user.email)) {
        throw redirect(303, '/');
    }

    return {
        session
    };
};
