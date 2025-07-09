const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { topic, length } = req.body;

  const prompt = `Write a ${length} essay on the topic: ${topic}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenRouter-Model': 'tencent/hunyuan', // ✅ New free model
        'X-Title': 'AI Essay Generator'
      },
      body: JSON.stringify({
        model: 'tencent/hunyuan',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ essay: data.choices[0].message.content });
    } else {
      console.error('OpenRouter error response:', data);
      res.status(500).json({ error: 'Failed to generate essay.' });
    }

  } catch (error) {
    console.error('Error generating essay:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
