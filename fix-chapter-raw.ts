
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.POSTGRES_URL;

const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function run() {
    try {
        console.log('Connecting...');
        const client = await pool.connect();

        const courseId = '348d5c8a-b1c5-4d16-b564-bbdaf0b6f29e';
        console.log('Inserting data for course:', courseId);

        // 1. Insert Part
        const partId = '11111111-1111-1111-1111-111111111111'; // Deterministic UUID
        const partRes = await client.query(`
            INSERT INTO course_parts (id, course_id, title, slug, "order")
            VALUES ($1, $2, 'Introduction', 'introduction', 1)
            ON CONFLICT (id) DO NOTHING
            RETURNING id
        `, [partId, courseId]);
        console.log('Part insert result:', partRes.rowCount);

        // 2. Insert Chapter
        const chapterId = '22222222-2222-2222-2222-222222222222';
        const chapterRes = await client.query(`
            INSERT INTO course_chapters (id, course_id, part_id, title, slug, content, "order")
            VALUES ($1, $2, $3, 'Welcome', 'intro', '# Welcome\n\nThis is raw SQL inserted content.', 1)
            ON CONFLICT (id) DO NOTHING
        `, [chapterId, courseId, partId]);
        console.log('Chapter insert result:', chapterRes.rowCount);

        client.release();
    } catch (e) {
        console.error('RAW PG ERROR:', e);
    } finally {
        await pool.end();
    }
}

run();
