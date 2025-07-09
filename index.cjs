const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend

// POST /generate – Handle essay generation
app.post('/generate', async (req, res) => {
  const { topic, length } = req.body;

  // Prepare prompt
  const prompt = `Write a ${length} essay on the topic: ${topic}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'tencent-hunyuan/a13b-instruct', // ✅ Correct model
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yourdomain.com', // Optional but recommended
          'X-Title': 'AI Essay Generator',
          'OpenRouter-Model': 'tencent-hunyuan/a13b-instruct' // ✅ Correct header
        }
      }
    );

    const data = response.data;

    // Handle AI response
    if (data.choices && data.choices.length > 0) {
      res.json({ essay: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'AI response incomplete or missing.' });
    }
  } catch (err) {
    console.error('❌ Error generating essay:', err.response?.data || err.message);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at: http://localhost:${PORT}`);
});
