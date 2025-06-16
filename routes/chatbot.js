// routes/chatbot.js
const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

const router = express.Router();

// 🧠 Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env
});

// 🧠 POST /api/chatbot
router.post('/', async (req, res) => {
    const userMessage = req.body.message;

    console.log('\n🧠 [AI CHATBOT] POST /api/chatbot');
    console.log('📨 Incoming user message:', userMessage);

    try {
        console.log('🛠️ Preparing request to OpenAI ChatGPT...');

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or "gpt-4" if you have access
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

        const reply = completion.choices[0].message.content;
        console.log('🤖 AI Reply:', reply);
        res.json({ reply });

    } catch (err) {
        console.error('❌ OpenAI API error:', err.response?.data || err.message);
        res.status(500).json({ error: 'AI failed to respond.' });
    }
});

module.exports = router;
