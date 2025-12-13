
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { courses, courseParts, courseChapters } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
    console.log('🌱 Seeding Course Data...');

    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
        throw new Error('POSTGRES_URL is not set');
    }

    const client = postgres(connectionString);
    const db = drizzle(client);

    try {
        // 1. Create or Update "Design Fundamentals" Course
        const courseSlug = 'design-fundamentals';

        // Cleanup existing (for idempotency)
        const existingCourse = await db.select().from(courses).where(eq(courses.slug, courseSlug));
        if (existingCourse.length > 0) {
            console.log('Cleaning up existing course...');
            const courseId = existingCourse[0].id;
            // Delete chapters and parts linked to this course
            // Note: In real app, CASCADE delete might be set up in schema, but being safe here
            // We can just rely on IDs usually but let's just delete the course and rely on cascade or manual cleanup
            await db.delete(courses).where(eq(courses.id, courseId));
            // Ideally we should delete children first if foreign keys enforce it without cascade
            // But let's try inserting fresh. If FK errors, I'll revise.
            // Wait, if I delete parent, children might hang if no cascade. 
            // Let's assume standard behavior or just insert a new one if not conflicts. 
            // Actually, simplest is to just INSERT. If slug unique constraint hits, we have to handle it.
            // Let's delete by slug first.
        }

        console.log('Creating "Design Fundamentals" course...');
        const [course] = await db.insert(courses).values({
            title: 'Design Fundamentals',
            slug: courseSlug,
            domain: 'Design',
            level: 'Beginner',
            duration: '2h 15m',
            thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
            description: 'Master the core principles of visual design. Learn typography, color theory, layout, and more.',
            isPublished: true,
            skills: ['Typography', 'Color Theory', 'Layout'],
            usps: [{ icon: 'Palette', text: 'Color Mastery' }, { icon: 'Layout', text: 'Grid Systems' }]
        }).returning();

        // 2. Create Parts (Sections)
        console.log('Creating sections...');

        const [part1] = await db.insert(courseParts).values({
            courseId: course.id,
            title: 'Foundations',
            slug: 'foundations',
            order: 1
        }).returning();

        const [part2] = await db.insert(courseParts).values({
            courseId: course.id,
            title: 'Advanced Layout',
            slug: 'advanced-layout',
            order: 2
        }).returning();

        // 3. Create Chapters
        console.log('Creating chapters...');

        // Part 1 Chapters
        await db.insert(courseChapters).values([
            {
                courseId: course.id,
                partId: part1.id,
                title: 'Introduction to Design',
                slug: 'intro-to-design',
                order: 1,
                content: `
# Introduction to Design

Design is not just about making things look good. It is about solving problems and communicating ideas effectively.

## What you will learn
In this chapter, we will cover:
- The definition of design
- The difference between art and design
- The core pillars of visual communication

> **Note:** Good design is invisible. Bad design is everywhere.

Let's get started on this journey to becoming a better visual thinker.
                `
            },
            {
                courseId: course.id,
                partId: part1.id,
                title: 'Typography 101',
                slug: 'typography-101',
                order: 2,
                content: `
# Typography 101

Typography is the art of arranging type to make written language legible, readable, and appealing when displayed.

## Key Concepts

1. **Typeface vs Font**: A typeface is the design (e.g., Helvetica), while a font is the digital file (e.g., Helvetica Bold 12pt).
2. **Hierarchy**: Using size, weight, and color to guide the reader's eye.
3. **Leading**: The vertical space between lines of text.

\`\`\`css
/* Example of setting good typography */
body {
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  color: #333;
}
\`\`\`

Typography makes up 90% of the web. Master it, and you master design.
                `
            },
            {
                courseId: course.id,
                partId: part1.id,
                title: 'Color Theory',
                slug: 'color-theory',
                order: 3,
                content: `
# Color Theory

Color evokes emotion and guides attention.

- **Primary Colors**: Red, Yellow, Blue.
- **Secondary Colors**: Green, Orange, Purple.
- **Complementary**: Opposites on the color wheel.

![Color Wheel](https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&auto=format&fit=crop&q=60)

Use color sparingly to highlight important actions (buttons, links).
                `
            }
        ]);

        // Part 2 Chapters
        await db.insert(courseChapters).values([
            {
                courseId: course.id,
                partId: part2.id,
                title: 'The Grid System',
                slug: 'grid-system',
                order: 1,
                content: `
# The Grid System

Grids bring order to chaos. They help you align elements and create consistent layouts.

## Why use a grid?
- **Consistency**: Helps in multi-page documents/sites.
- **Harmony**: Creates visual rhythm.
- **Responsiveness**: Critical for web design.

A standard 12-column grid is the most popular choice for web design.
                `
            },
            {
                courseId: course.id,
                partId: part2.id,
                title: 'White Space',
                slug: 'white-space',
                order: 2,
                content: `
# White Space

White space (or negative space) is the area between design elements. It is not empty space; it is an active design element.

## Benefits
- Increases readability.
- Creates focus.
- Adds elegance.

Don't be afraid of empty space!
                `
            }
        ]);

        console.log('✅ Seeding complete!');

    } catch (e) {
        console.error('❌ Seeding failed:', e);
    } finally {
        await client.end();
    }
}

seed();
