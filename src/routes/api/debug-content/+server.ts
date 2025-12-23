
import { db } from '$lib/db/drizzle';
import { courseChapters, courses } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export async function GET() {
    const course = await db.query.courses.findFirst({
        where: eq(courses.slug, 'design-fundamentals')
    });

    if (!course) return json({ error: 'Course not found' });

    const chapter = await db.query.courseChapters.findFirst({
        where: and(
            eq(courseChapters.slug, 'intro-to-design'),
            eq(courseChapters.courseId, course.id)
        )
    });

    if (!chapter) return json({ error: 'Chapter not found' });

    return json({
        content_preview: chapter.content?.substring(0, 500) || 'No content',
        full_length: chapter.content?.length
    });
}
