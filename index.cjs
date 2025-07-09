const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS - Allow only your frontend
app.use(cors({
  origin: ['https://ai-fq7z.onrender.com'], // 🔒 Set to your deployed frontend URL
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Serve frontend files (from public folder)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Essay generation route
app.post('/generate', async (req, res) => {
  const { topic, length } = req.body;

  const prompt = `Write a ${length} essay on the topic: ${topic}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'tencent-hunyuan/hunyuan-chat',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-fq7z.onrender.com',
          'X-Title': 'AI Essay Generator',
          'OpenRouter-Model': 'tencent-hunyuan/hunyuan-chat'
        }
      }
    );

    const data = response.data;

    if (data.choices && data.choices.length > 0) {
      res.json({ essay: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'AI response incomplete or missing.' });
    }
  } catch (err) {
    console.error('❌ Error generating essay:', err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.error || 'Server error. Please try again later.'
    });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at: http://localhost:${PORT}`);
});
