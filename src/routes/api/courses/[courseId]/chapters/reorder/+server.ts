import { db } from '$lib/db/drizzle';
import { courseParts } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function PUT({ request, params }) {
    const { orderedIds } = await request.json();
    const { courseId } = params;

    // Transaction for safety? Or just parallel updates. 
    // Drizzle doesn't have a simple bulk update case yet, so Promise.all is common. (Or a huge CASE statement).
    // Given the small number of parts, Promise.all is fine.

    await Promise.all(
        orderedIds.map((id, index) =>
            db.update(courseParts)
                .set({ order: index })
                .where(eq(courseParts.id, id))
        )
    );

    return json({ success: true });
}
