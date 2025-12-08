
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db/drizzle';
import { inspirations } from '$lib/db/schema';

export const POST: RequestHandler = async ({ request }) => {
    // Stub for processing incoming emails (e.g. from SendGrid/Postmark)
    // Assume input { subject, body, from }

    try {
        const body = await request.json();
        const { subject, text, from } = body;

        console.log('Received Ingestion Email:', subject);

        // Simple logic: Create a DRAFT inspiration item
        await db.insert(inspirations).values({
            creatorName: from,
            // Extract URL from text regex in real impl
            resourceUrl: 'https://pending-review.com',
            thumbnailUrl: '',
            tags: ['Incoming', 'Email'],
            isActive: false // Draft
        });

        return json({ success: true, message: 'Item ingested as draft' });
    } catch (e) {
        console.error(e);
        return json({ error: 'Ingestion failed' }, { status: 500 });
    }
};
