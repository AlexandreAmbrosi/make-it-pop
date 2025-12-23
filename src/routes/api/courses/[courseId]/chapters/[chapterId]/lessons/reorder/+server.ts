import { db } from '$lib/db/drizzle';
import { courseChapters } from '$lib/db/schema';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function PUT({ request, params }) {
    const { orderedIds } = await request.json();
    // params.chapterId is actually the partId in this context if we nest it like .../chapters/[partId]/lessons/reorder
    // But the folder structure in the plan was .../chapters/[chapterId]/lessons/reorder.
    // "chapterId" in the URL usually refers to the ID of the chapter (part) we are modifying.

    // Let's verify the route params. 
    // If the file is src/routes/api/courses/[courseId]/chapters/[chapterId]/lessons/reorder/+server.ts
    // Then [chapterId] is the partId.

    await Promise.all(
        orderedIds.map((id, index) =>
            db.update(courseChapters)
                .set({ order: index })
                .where(eq(courseChapters.id, id))
        )
    );

    return json({ success: true });
}
