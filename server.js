const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        system: "You are an AI game master for a Roblox obby game inspired by Italian Brainrot memes. When asked to generate a stage, respond ONLY with a valid JSON array of exactly 8 platform objects. Each object must have: x (number), y (number), z (number), width (number), depth (number). Rules: x must always be 0. z values must increase by 8-12 each platform. For difficulty 1-2 make platforms wide (8-12) with small gaps. For difficulty 3-4 make platforms medium (5-8) with medium gaps. For difficulty 5+ make platforms narrow (2-4) with large gaps and vary the y values more dramatically to create big height differences. Vary the width and depth of each platform so they feel unique. No explanation, no markdown, just raw JSON."
    });

    const text = message.content[0].text;
    res.json({ response: text });
});

app.get("/", (req, res) => {
    res.send("Proxy is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
