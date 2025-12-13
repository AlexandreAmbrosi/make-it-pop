import { error, json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, url }) => {
    const fileName = url.searchParams.get('file');
    if (!fileName) error(400, 'Missing file name');

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const staticDir = path.resolve(process.cwd(), 'static', 'uploads');

    // Ensure dir exists
    await mkdir(staticDir, { recursive: true });

    const filePath = path.join(staticDir, fileName);
    await writeFile(filePath, buffer);

    return json({ success: true });
}
