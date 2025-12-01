const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Инициализация клиента Anthropic
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint для чата
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Сообщение не может быть пустым' });
        }

        // Отправка запроса к Claude API
        const response = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        });

        // Извлечение текста ответа
        const assistantMessage = response.content[0].text;

        res.json({ response: assistantMessage });

    } catch (error) {
        console.error('Ошибка при обращении к Claude API:', error);
        res.status(500).json({
            error: 'Ошибка сервера при обработке запроса'
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
