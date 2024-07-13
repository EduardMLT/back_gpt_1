require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const { PORT = 3000, SECRET_KEY_GPT } = process.env;

// Middleware для розпарсування JSON та CORS
app.use(express.json());
app.use(cors());

// Endpoint для обробки запитів від клієнта
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    console.log('Received message from client:', message);

    // Викликати ChatGPT API для отримання відповіді
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SECRET_KEY_GPT}`,
        },
      }
    );

    console.log('Response from OpenAI:', response.data);

    // Перевірка наявності відповіді від OpenAI API
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      res.json(response.data.choices[0].message.content);
    } else {
      res.status(500).json({ error: 'Invalid response from OpenAI API' });
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data && error.response.data.error) {
      res.status(500).json({ error: error.response.data.error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Прослуховування порту
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});