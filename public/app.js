// Клиентская логика чата
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const sendButton = document.getElementById('sendButton');

// Обработка отправки формы
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Добавить сообщение пользователя
    addMessage(userMessage, 'user');

    // Очистить поле ввода
    messageInput.value = '';

    // Отключить кнопку отправки
    sendButton.disabled = true;

    // Показать индикатор загрузки
    const loadingMessage = addMessage('Печатает...', 'loading');

    try {
        // Отправить запрос на сервер
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }

        const data = await response.json();

        // Удалить индикатор загрузки
        loadingMessage.remove();

        // Добавить ответ ассистента
        addMessage(data.response, 'assistant');

    } catch (error) {
        console.error('Ошибка:', error);
        loadingMessage.remove();
        addMessage('Произошла ошибка. Попробуйте еще раз.', 'assistant');
    } finally {
        // Включить кнопку отправки
        sendButton.disabled = false;
        messageInput.focus();
    }
});

// Функция добавления сообщения в чат
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;

    chatMessages.appendChild(messageDiv);

    // Автоскролл к последнему сообщению
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

// Отправка по Ctrl+Enter
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});
