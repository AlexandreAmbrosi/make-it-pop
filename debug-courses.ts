
import { db } from './src/lib/db/drizzle';
import { courses } from './src/lib/db/schema';
import 'dotenv/config';

async function run() {
    console.log('Testing courses query...');
    try {
        const all = await db.select().from(courses);
        console.log('Courses found:', all.length);
        console.log(all);
    } catch (e) {
        console.error('Query Failed:', e);
    }
}

run();
