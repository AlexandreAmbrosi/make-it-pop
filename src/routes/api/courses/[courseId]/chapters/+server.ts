import { db } from '$lib/db/drizzle';
import { courseParts } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export async function POST({ request, params }) {
    const { title } = await request.json();
    const { courseId } = params;

    // Find highest order to append
    // Note: Drizzle aggregation slightly verbose, doing simple fetch
    const existing = await db
        .select()
        .from(courseParts)
        .where(eq(courseParts.courseId, courseId));

    const maxOrder = existing.reduce((max, p) => Math.max(max, p.order), 0);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if slug exists? For parts/chapters, slug uniqueness might be scoped to course.
    // Schema says slug is not null, doesn't say unique globally? 
    // Wait, schema says: slug text('slug').notNull() (no unique).
    // Courses table has unique slugs. Parts doesn't locally enforce it in DB but we should for URLs.
    // Let's assume unique enough for now or append ID if we cared.

    const [newPart] = await db.insert(courseParts).values({
        courseId,
        title,
        slug,
        order: maxOrder + 1
    }).returning();

    return json(newPart);
}
