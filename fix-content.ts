
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { eq, and } from 'drizzle-orm';
import * as schema from './src/lib/db/schema';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.error("POSTGRES_URL not found");
    process.exit(1);
}

const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const db = drizzle(pool, { schema });

async function main() {
    const course = await db.query.courses.findFirst({
        where: eq(schema.courses.slug, 'design-fundamentals')
    });

    if (!course) {
        console.log("Course not found");
        return;
    }

    const cleanContent = `
        <h1>Introduction to Design</h1>
        <p>Design is not just about making things look good. It is about solving problems and communicating ideas effectively.</p>
        <p>In this course, we will explore the core principles that make designs work.</p>
    `;

    // Force update again
    const result = await db.update(schema.courseChapters)
        .set({ content: cleanContent })
        .where(
            and(
                eq(schema.courseChapters.slug, 'intro-to-design'),
                eq(schema.courseChapters.courseId, course.id)
            )
        )
        .returning({ updatedId: schema.courseChapters.id });

    console.log(`Content cleaned for 'intro-to-design'. Updated ${result.length} rows.`);
    process.exit(0);
}

main().catch(console.error);
