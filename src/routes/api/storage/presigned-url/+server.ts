import storage from '$lib/storage';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    // Optional: Add auth check here (e.g. if (!locals.user) error(401))

    const { name, type } = await request.json();

    if (!name || !type) {
        return json({ error: 'Missing name or type' }, { status: 400 });
    }

    // We might want to prefix the name with a folder like 'courses/images/'
    // but local storage might want flat or we rely on 'courses-' prefix.
    const s3Name = `courses-${Date.now()}-${name}`;

    try {
        const signedUrl = await storage.upload({ name: s3Name, type });

        if (!signedUrl) {
            return json({ error: 'Failed to generate upload URL' }, { status: 500 });
        }

        // For local storage, the public View URL is /uploads/filename
        // For S3 it's dependent on bucket. 
        // storage.retrieve should give us the public URL.

        let fileKey = s3Name; // Default key

        // Get the public URL for viewing
        const publicUrl = await storage.retrieve(fileKey);

        return json({
            signedUrl,
            fileKey,
            publicUrl
        });
    } catch (e) {
        console.error('Storage upload initialization failed:', e);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
