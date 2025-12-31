import { db } from '$lib/db/drizzle';
import { courses, courseChapters } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import hljs from 'highlight.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
    const { chapterSlug } = params;
    const { course, structure } = await parent(); // Get course and structure from layout

    // Fetch chapter by Slug AND CourseId (via relation or directly if we join)
    // Since slug might not be globally unique (e.g. 'intro'), we must filter by course.
    // But `courseChapters` has `courseId`.

    // Check if course exists (it should via parent)

    const chapter = await db.query.courseChapters.findFirst({
        where: and(
            eq(courseChapters.slug, chapterSlug),
            eq(courseChapters.courseId, course.id)
        )
    });

    if (!chapter) {
        throw error(404, 'Chapter not found');
    }

    // Fix: Tiptap saves HTML, so marked() ignores the code blocks.
    // We must manually find <pre><code class="language-..."> blocks and highlight them.
    let contentHtml = chapter.content || '';

    // Improved Regex to find code blocks, supporting both with and without language class
    // Matches: <pre><code ... class="... language-js ..." ...> ... </code></pre> OR <pre><code> ... </code></pre>
    contentHtml = contentHtml.replace(
        /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
        (match: string, attributes: string, codeContent: string) => {
            // Check for class="language-..." in attributes
            const langMatch = attributes.match(/class="[^"]*language-([\w-]+)[^"]*"/);
            const lang = langMatch ? langMatch[1] : null;

            // Decode HTML entities
            const decodedCode = codeContent
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");

            try {
                let highlighted;
                let usedLang = lang || 'plaintext';

                if (lang && hljs.getLanguage(lang)) {
                    highlighted = hljs.highlight(decodedCode, { language: lang }).value;
                } else {
                    // Auto-detect language if none specified or invalid
                    const auto = hljs.highlightAuto(decodedCode);
                    highlighted = auto.value;
                    usedLang = auto.language || 'plaintext';
                }

                // Return reconstructed block with hljs classes
                return `<pre><code class="language-${usedLang} hljs">${highlighted}</code></pre>`;
            } catch (e) {
                return match;
            }
        }
    );

    // Flatten chapters for pagination
    // Define type for structure item if possible, but any[] is fine for now as we infer from usage
    const allChapters = structure.flatMap((part: any) => part.chapters);

    const currentIndex = allChapters.findIndex((c: any) => c.id === chapter.id);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    return {
        chapter: {
            ...chapter,
            html: contentHtml
        },
        pagination: {
            prev: prevChapter,
            next: nextChapter
        }
    };
};
