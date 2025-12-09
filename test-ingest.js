
async function test() {
    try {
        const res = await fetch('http://localhost:5173/api/ai/toolz/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'https://github.com' })
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
test();
