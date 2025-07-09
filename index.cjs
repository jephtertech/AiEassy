const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate', async (req, res) => {
  const { topic, length } = req.body;
  const prompt = `Write a ${length} essay on the topic: ${topic}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'tencent-hunyuan/hunyuan-chat',
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yourdomain.com',
          'X-Title': 'AI Essay Generator',
          'OpenRouter-Model': 'tencent-hunyuan/hunyuan-chat'
        }
      }
    );

    const data = response.data;
    if (data.choices?.length) {
      res.json({ essay: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'AI response incomplete.' });
    }
  } catch (err) {
    console.error('❌ AI generation error:', err.message);
    res.status(500).json({ error: 'Server error. Try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
