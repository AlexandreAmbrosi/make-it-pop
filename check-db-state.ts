import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './src/lib/db/schema';
import { eq } from 'drizzle-orm';

function parseUrlToConfig(url) {
    if (!url) throw new Error('No URL');
    // Simple parsing for check script
    // Assuming the URL is valid now as user confirmed
    let clean = url.replace(/\s/g, '').replace(/^['"]|['"]$/g, '');
    return { connectionString: clean, ssl: { rejectUnauthorized: false } };
}

async function check() {
    console.log('Checking DB State...');
    const rawUrl = process.env.POSTGRES_URL;
    if (!rawUrl) {
        console.error('No POSTGRES_URL');
        return;
    }

    const pool = new pg.Pool({ connectionString: rawUrl, ssl: { rejectUnauthorized: false } });
    const db = drizzle(pool, { schema });

    try {
        const t = await db.select().from(schema.tools);
        console.log(`Tools: ${t.length}`);

        const i = await db.select().from(schema.inspirations);
        console.log(`Inspirations: ${i.length}`);

        const c = await db.select().from(schema.courses);
        console.log(`Courses: ${c.length}`);

        if (c.length > 0) {
            console.log(`Sample Course: ${c[0].title} (${c[0].id})`);
            const p = await db.select().from(schema.courseParts).where(eq(schema.courseParts.courseId, c[0].id));
            console.log(`Parts for course: ${p.length}`);

            if (p.length > 0) {
                const ch = await db.select().from(schema.courseChapters).where(eq(schema.courseChapters.partId, p[0].id));
                console.log(`Chapters for part 1: ${ch.length}`);
            }
        }
    } catch (e) {
        console.error('Check failed:', e);
    } finally {
        await pool.end();
    }
}

check();
