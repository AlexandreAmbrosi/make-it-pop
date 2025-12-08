
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import 'dotenv/config';
import { randomUUID } from 'crypto';

// Minimal schema without defaultRandom
const courseParts = pgTable('course_parts', {
    id: uuid('id').primaryKey(), // Manual ID
    courseId: uuid('course_id').notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    order: integer('order').notNull(),
});

const courseChapters = pgTable('course_chapters', {
    id: uuid('id').primaryKey(),
    courseId: uuid('course_id').notNull(),
    partId: uuid('part_id').notNull(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    content: text('content'),
    order: integer('order').notNull(),
});

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
    console.error('No POSTGRES_URL');
    process.exit(1);
}

const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const db = drizzle(pool);

async function fix() {
    const courseId = '348d5c8a-b1c5-4d16-b564-bbdaf0b6f29e';
    console.log('Fixing chapters for course:', courseId);

    try {
        // 1. Check/Create Part
        let [part] = await db.select().from(courseParts).where(eq(courseParts.courseId, courseId)).limit(1);

        if (!part) {
            console.log('Creates default "Introduction" part...');
            const newId = randomUUID();
            await db.insert(courseParts).values({
                id: newId,
                courseId,
                title: 'Introduction',
                slug: 'introduction',
                order: 1
            });
            part = { id: newId };
            console.log('Part created.');
        } else {
            console.log('Found existing part:', part.id);
        }

        // 2. Check/Create Chapter (Intro)
        const chapterSlug = 'intro';
        const [chapter] = await db.select().from(courseChapters)
            .where(eq(courseChapters.slug, chapterSlug))
            .limit(1);

        if (!chapter) {
            console.log('Creating "Intro" chapter...');
            await db.insert(courseChapters).values({
                id: randomUUID(),
                courseId,
                partId: part.id,
                title: 'Welcome to the Course',
                slug: chapterSlug,
                content: `
# Welcome to UI Design Fundamentals

This is the newly inserted chapter content!
                `.trim(),
                order: 1
            });
            console.log('Chapter created successfully.');
        } else {
            console.log('Chapter "intro" already exists.');
        }

    } catch (e) {
        console.error('Fix failed:', e);
        // Try file write again just in case
        const fs = require('fs');
        fs.writeFileSync('error.log', String(e));
    } finally {
        await pool.end();
    }
}

fix();
