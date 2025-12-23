
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { eq, and } from 'drizzle-orm';
import * as schema from './src/lib/db/schema';
import fs from 'fs';

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

    const chapter = await db.query.courseChapters.findFirst({
        where: and(
            eq(schema.courseChapters.slug, 'intro-to-design'),
            eq(schema.courseChapters.courseId, course.id)
        )
    });

    if (!chapter) {
        console.log("Chapter not found");
        return;
    }

    fs.writeFileSync('chapter-content-dump.txt', chapter.content || '');
    console.log(`Content dumped to chapter-content-dump.txt (${chapter.content?.length} bytes)`);
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
