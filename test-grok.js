require('dotenv').config();

async function testGrok() {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
        console.error("Error: GROK_API_KEY not found in .env");
        return;
    }

    console.log("Testing Grok API with key ending in...", apiKey.slice(-4));

    try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a test bot." },
                    { role: "user", content: "Say hello" }
                ],
                model: "grok-beta",
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Success! Response:", data.choices[0].message.content);

    } catch (error) {
        console.error("Test Failed:", error.message);
    }
}

testGrok();
