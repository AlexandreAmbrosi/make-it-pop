import 'dotenv/config';

function fixUrl(url) {
    if (!url) return '';
    try {
        // try formatting
        const prefix = 'postgresql://';
        if (!url.startsWith(prefix)) return url;

        // Find the split between Auth and Host
        // Auth ends at the LAST '@' before the path '/'? 
        // Actually, host part shouldn't have '@'.
        // Password MIGHT have '@'.
        // So we look for the LAST '@' in the string? 
        // URL: postgresql://user:pass@host:port/db
        // If db name has '@', that's weird.
        // Assuming standard format.

        // We can't use new URL() effectively if it's broken.
        // Manual parsing.

        const withoutPrefix = url.substring(prefix.length);
        const lastAt = withoutPrefix.lastIndexOf('@');
        if (lastAt === -1) return url; // No auth?

        const auth = withoutPrefix.substring(0, lastAt);
        const rest = withoutPrefix.substring(lastAt + 1);

        // Auth is user:pass
        const firstColon = auth.indexOf(':');
        if (firstColon === -1) return url; // No password?

        const user = auth.substring(0, firstColon);
        const pass = auth.substring(firstColon + 1);

        // Encode password!
        const encodedPass = encodeURIComponent(pass);

        // Reconstruct
        const newUrl = `${prefix}${user}:${encodedPass}@${rest}`;
        return newUrl;
    } catch (e) {
        return url;
    }
}

const rawUrl = process.env.POSTGRES_URL;
console.log('Valid before fix:', isValid(rawUrl));
const fixedUrl = fixUrl(rawUrl);
console.log('Valid after fix:', isValid(fixedUrl));

if (isValid(fixedUrl)) {
    console.log('Fixed URL prefix:', fixedUrl.substring(0, 20));
}

function isValid(u) {
    try {
        new URL(u);
        return true;
    } catch (e) {
        return false;
    }
}
