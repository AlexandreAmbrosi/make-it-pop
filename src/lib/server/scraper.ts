
/**
 * Scrapes the content of a given URL and returns a simplified text version.
 * Uses a lightweight approach: fetch + regex stripping of scripts/styles/tags.
 */
export async function scrapeUrl(url: string): Promise<string | null> {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'MakeItPopBot/1.0 (Mozilla/5.0 compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            },
        });

        if (!res.ok) {
            console.error(`Failed to fetch ${url}: ${res.status}`);
            return null;
        }

        const html = await res.text();

        // 1. Remove Scripts and Styles
        let text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, " ")
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, " ");

        // 2. Remove comments
        text = text.replace(/<!--[\s\S]*?-->/g, "");

        // 3. Remove metadata and other non-body tags that might clutter (optional but helpful)
        // For simplicity, just strip all tags now.
        text = text.replace(/<[^>]+>/g, ' ');

        // 4. Decode entities (basic ones)
        text = text.replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');

        // 5. Compress whitespace
        text = text.replace(/\s+/g, ' ').trim();

        // Limit length to avoid blowing up AI tokens context window too much
        return text.slice(0, 15000); // 15k chars is roughly 3-4k tokens
    } catch (e) {
        console.error(`Error scraping ${url}:`, e);
        return null;
    }
}
