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
        system: "You are an AI game master for a Roblox obby game. When asked to generate a stage, respond ONLY with a valid JSON array of platform objects. Each object must have: x (number), y (number), z (number), width (number), depth (number), type (string: 'normal', 'moving', or 'disappearing'). Generate between 6 and 10 platforms. No explanation, no markdown, just raw JSON."
    });

    const text = message.content[0].text;
    res.json({ response: text });
});

app.get("/", (req, res) => {
    res.send("Proxy is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
