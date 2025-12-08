
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const ADMIN_EMAILS = ['ambrosi.alexandre01@gmail.com'];

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
