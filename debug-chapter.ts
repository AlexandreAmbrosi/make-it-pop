
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { pgTable, text, uuid, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { eq, and } from 'drizzle-orm';
import 'dotenv/config';

// Define minimal schema locally to avoid import issues
const courses = pgTable('courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
});

const courseChapters = pgTable('course_chapters', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id').notNull(),
    slug: text('slug').notNull(),
});

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.error('POSTGRES_URL missing');
    process.exit(1);
}

const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

async function test() {
    console.log('Testing DB connection...');
    const courseId = '348d5c8a-b1c5-4d16-b564-bbdaf0b6f29e';
    const slug = 'intro';

    try {
        console.log(`Fetching course ${courseId}...`);
        const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
        console.log('Course result:', course);

        if (!course) {
            console.log('Course not found in DB (so it would be 404).');
            return;
        }

        console.log(`Fetching chapter ${slug}...`);
        const [chapter] = await db.select().from(courseChapters)
            .where(and(
                eq(courseChapters.courseId, courseId),
                eq(courseChapters.slug, slug)
            ))
            .limit(1);
        console.log('Chapter result:', chapter);

    } catch (e) {
        console.error('CRITICAL DB ERROR:', e);
    } finally {
        await pool.end();
    }
}

test();
