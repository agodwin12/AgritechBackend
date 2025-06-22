const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

const router = express.Router();

// 🧠 Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 POST /api/chatbot
router.post('/', async (req, res) => {
    const userMessage = req.body.message;

    console.log('\n🧠 [AI CHATBOT] POST /api/chatbot');
    console.log('📨 Incoming user message:', userMessage);

    if (!userMessage || userMessage.trim() === "") {
        console.warn("⚠️ Empty message received from user.");
        return res.status(400).json({ error: "Message cannot be empty." });
    }

    try {
        console.log('🛠️ Preparing request to OpenAI ChatGPT...');

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an AI assistant for a Cameroon-based agritech app. Help users with:
- Registration
- Selling crops
- Checking market prices
- Crop advisory
- Contacting support`,
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
        });

        console.log("✅ OpenAI raw response:", JSON.stringify(completion, null, 2));

        const reply = completion?.choices?.[0]?.message?.content?.trim();

        if (!reply) {
            console.warn("⚠️ No valid reply from OpenAI, using fallback.");
            return res.json({
                reply: "🤖 I couldn’t process your request right now. Please try again shortly or rephrase your question.",
            });
        }

        console.log('🤖 AI Reply:', reply);
        res.json({ reply });

    } catch (err) {
        console.error('❌ OpenAI API error:', err.response?.data || err.message);
        res.status(500).json({
            error: 'AI failed to respond due to a server or network issue. Please try again.',
        });
    }
});

module.exports = router;
