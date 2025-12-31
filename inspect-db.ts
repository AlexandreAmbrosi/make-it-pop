
import { db } from './src/lib/db/drizzle';
import { courseChapters } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log("Fetching first chapter...");
    try {
        const chapter = await db.query.courseChapters.findFirst();
        if (chapter) {
            console.log("--- CHAPTER CONTENT START ---");
            console.log(chapter.content);
            console.log("--- CHAPTER CONTENT END ---");
        } else {
            console.log("No chapters found.");
        }
    } catch (e) {
        console.error("Error fetching chapter:", e);
    }
}

main();
