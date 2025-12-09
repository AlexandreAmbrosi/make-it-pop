import { json } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { tools } from '$lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function POST({ request }) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.url) {
            return json({ error: 'Name and URL are required' }, { status: 400 });
        }

        // Insert into database
        const [newTool] = await db.insert(tools).values({
            name: data.name,
            url: data.url,
            shortDescription: data.shortDescription || '',
            imageUrl: data.imageUrl || null,
            type: data.type || 'Online Tool',
            pricing: data.pricing || 'free',
            tags: data.tags || [],
            isActive: data.isActive !== undefined ? data.isActive : true,
            updatedAt: new Date()
        }).returning();

        return json({ success: true, tool: newTool });
    } catch (e) {
        console.error("Error creating tool:", e);
        return json({ error: 'Failed to create tool' }, { status: 500 });
    }
}

// Single or Bulk Update
export async function PATCH({ request }) {
    try {
        const data = await request.json();
        const { id, ids, ...updates } = data;

        // Ensure we don't accidentally wipe data with empty updates if that's not intended
        // But for toggle/select, we might send explicit nulls? 
        // Drizzle ignores undefined usually.

        let result = [];

        if (id) {
            // Single Update
            result = await db.update(tools)
                .set({ ...updates, updatedAt: new Date() })
                .where(eq(tools.id, id))
                .returning();
        } else if (ids && Array.isArray(ids) && ids.length > 0) {
            // Bulk Update
            result = await db.update(tools)
                .set({ ...updates, updatedAt: new Date() })
                .where(inArray(tools.id, ids))
                .returning();
        } else {
            return json({ error: 'Missing id or ids' }, { status: 400 });
        }

        return json({ success: true, count: result.length, tools: result });

    } catch (e) {
        console.error("Error updating tool:", e);
        return json({ error: 'Failed to update tool' }, { status: 500 });
    }
}

// Bulk Delete
export async function DELETE({ request }) {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return json({ error: 'Missing ids array' }, { status: 400 });
        }

        const result = await db.delete(tools)
            .where(inArray(tools.id, ids))
            .returning();

        return json({ success: true, count: result.length });

    } catch (e) {
        console.error("Error deleting tools:", e);
        return json({ error: 'Failed to delete tools' }, { status: 500 });
    }
}
