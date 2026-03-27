const axios = require('axios');
require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('Error sending Telegram message:', error.response ? error.response.data : error.message);
    }
}

async function notifyTaskCaptured(task) {
    const message = `
📌 <b>Task Captured</b>

📝 <b>Task:</b> ${task.taskText}
⏰ <b>Reminder:</b> ${task.reminderTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
💬 <b>Source:</b> WhatsApp (${task.source})
    `.trim();
    await sendTelegramMessage(message);
}

async function notifyReminder(task) {
    const message = `
🔔 <b>Reminder</b>

<b>Task:</b> ${task.taskText}
<b>Source:</b> WhatsApp (${task.source})
<b>Time:</b> ${task.reminderTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim();
    await sendTelegramMessage(message);
}

module.exports = { notifyTaskCaptured, notifyReminder };
