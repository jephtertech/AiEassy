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
                                              'HTTP-Referer': 'https://yourdomain.com', // optional
                                                      'X-Title': 'AI Essay Generator',           // optional
                                                              'OpenRouter-Model': 'mistralai/mistral-7b-instruct' // ✅ FREE MODEL
                                                                    },
                                                                          body: JSON.stringify({
                                                                                  model: 'mistralai/mistral-7b-instruct', // still needed for body
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