import { db } from '$lib/db/drizzle';
import { courseChapters } from '$lib/db/schema'; // "courseChapters" table = Lessons in UI
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function POST({ request, params }) {
    const { title } = await request.json();
    const { courseId, chapterId } = params; // chapterId here corresponds to partId in DB

    const existing = await db
        .select()
        .from(courseChapters)
        .where(eq(courseChapters.partId, chapterId)); // chapterId = partId

    const maxOrder = existing.reduce((max, p) => Math.max(max, p.order), 0);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const [newLesson] = await db.insert(courseChapters).values({
        courseId, // Redundant but req
        partId: chapterId,
        title,
        slug,
        order: maxOrder + 1,
        content: ''
    }).returning();

    return json(newLesson);
}
