
import { db } from '$lib/db/drizzle';
import { courses, courseParts, courseChapters } from '$lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
    const { courseId } = params;

    // 1. Fetch Course Details (Try by ID first, then Slug if UUID fails or just generic string)
    // Actually, usually [courseId] is an ID. But if we want slug in URL, we should rename param to [courseSlug] or handle both.
    // Given the previous files used [courseId], I'll assume it might be a UUID. 
    // However, user friendly URLs usually use slugs. The seed script used a slug 'design-fundamentals'. 
    // If I use the slug in the URL, I need to query by slug.

    // Let's try to find by UUID or Slug for robustness, or just assume it is the ID/Slug based on format.
    // For simplicity, let's assume the URL param might be the SLUG if it's not a UUID.

    let course;
    // Simple check if it looks like a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);

    if (isUuid) {
        course = await db.query.courses.findFirst({
            where: eq(courses.id, courseId)
        });
    } else {
        course = await db.query.courses.findFirst({
            where: eq(courses.slug, courseId)
        });
    }

    if (!course) {
        throw error(404, 'Course not found');
    }

    // 2. Fetch Parts & Chapters
    // We want a hierarchy: Parts -> Chapters
    // If a course has no parts, chapters might be direct children (partId null?), but our schema implies partId is NOT NULL.
    // So all chapters must belong to a part.

    const parts = await db.query.courseParts.findMany({
        where: eq(courseParts.courseId, course.id),
        orderBy: [asc(courseParts.order)],
        with: {
            chapters: {
                orderBy: [asc(courseChapters.order)]
            }
        }
    });

    return {
        course,
        structure: parts
    };
};
