
import hljs from 'highlight.js';

const sampleHtml = `
<p>Some text</p>
<pre><code class="language-typescript">import { Button } from '$lib/components/ui/button';

const x = 10;
function test() {
  return "hello";
}</code></pre>
<p>More text</p>
`;

console.log("--- INPUT HTML ---");
console.log(sampleHtml);

let contentHtml = sampleHtml;

// The exact regex and logic from +page.server.ts
contentHtml = contentHtml.replace(
    /<pre><code[^>]*class="[^"]*language-([\w-]+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, codeContent) => {
        console.log(`\n[MATCH FOUND] Lang: ${lang}`);

        const decodedCode = codeContent
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        console.log("[DECODED CONTENT]:", decodedCode.substring(0, 50));

        try {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            console.log(`[DETECTED LANG]: ${language}`);

            const highlighted = hljs.highlight(decodedCode, { language }).value;
            console.log("[HIGHLIGHTED OUTPUT START]:", highlighted.substring(0, 50));

            return `<pre><code class="language-${lang} hljs">${highlighted}</code></pre>`;
        } catch (e) {
            console.error("[ERROR]:", e);
            return match;
        }
    }
);

console.log("\n--- OUTPUT HTML ---");
console.log(contentHtml);
