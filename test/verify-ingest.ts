
import dotenv from 'dotenv';
dotenv.config();

async function testIngest() {
    try {
        console.log("Testing AI Ingestion Endpoint...");
        const response = await fetch('http://localhost:5173/api/ai/toolz/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'https://example.com' })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ SUCCESS! API Key is working.");
            console.log("AI Response:", JSON.stringify(data, null, 2));
        } else {
            console.error("❌ FAILED. Status:", response.status);
            console.error("Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("❌ Connection Error:", e);
    }
}

testIngest();
