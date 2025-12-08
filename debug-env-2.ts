import 'dotenv/config';

const url = process.env.POSTGRES_URL;
if (!url) {
    console.log('URL IS EMPTY');
} else {
    console.log('URL Length:', url.length);
    console.log('First 5:', url.substring(0, 5));
    console.log('Ends with quote?', url.endsWith("'") || url.endsWith('"'));
    // simplistic host extraction for log
    const parts = url.split('@');
    if (parts.length > 1) {
        const hostPart = parts[1].split('/')[0];
        console.log('Host part:', hostPart);
    } else {
        console.log('No @ symbol found in URL');
    }
}
