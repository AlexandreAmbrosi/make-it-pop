import { db } from '$lib/db/drizzle';
import { courseParts } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function PUT({ request, params }) {
    const { title, icon } = await request.json();
    const { chapterId } = params; // This corresponds to courseParts.id

    // Construct update data dynamically
    const updateData: Partial<typeof courseParts.$inferInsert> = {};
    if (title !== undefined) updateData.title = title;
    if (icon !== undefined) updateData.icon = icon;

    const [updated] = await db.update(courseParts)
        .set(updateData)
        .where(eq(courseParts.id, chapterId))
        .returning();

    return json(updated);
}

export async function DELETE({ params }) {
    const { chapterId } = params;

    // Check if it has lessons? Ideally yes, but for now simple delete
    // Referential integrity might block it if we don't cascade.
    // Drizzle schema references() doesn't automatically imply cascade delete in app logic unless configured in DB.
    // Let's assume naive delete for now.

    await db.delete(courseParts).where(eq(courseParts.id, chapterId));
    return json({ success: true });
}
