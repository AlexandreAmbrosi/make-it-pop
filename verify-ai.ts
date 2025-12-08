
async function main() {
    console.log("Testing AI Endpoint locally...");
    try {
        const response = await fetch('http://localhost:5173/api/ai/toolz/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: 'design tools', mode: 'ask' })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

main();
