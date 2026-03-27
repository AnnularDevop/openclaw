const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { parseTask } = require('./parser');
const { notifyTaskCaptured } = require('./notifier');
const { scheduleReminder } = require('./scheduler');
const { saveTask } = require('./storage');
require('dotenv').config();

const ALLOWED_GROUP = process.env.ALLOWED_GROUP || 'OnCampusErp';
const ALLOWED_CONTACTS = (process.env.ALLOWED_CONTACTS || '').split(',').map(c => c.trim());
const USER_NAME = process.env.USER_NAME || 'Abdul';

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Scan the QR code below to log in to WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const sender = await msg.getContact();
    const sourceName = chat.isGroup ? chat.name : sender.pushname;

    // 1. Filter by Group or Contact
    const isAllowedSource = (chat.name === ALLOWED_GROUP) || 
                          ALLOWED_CONTACTS.some(allowed => 
                              sender.pushname?.includes(allowed) || 
                              sender.number.includes(allowed) || 
                              chat.name?.includes(allowed)
                          );
    
    if (!isAllowedSource) return;

    // 2. Parse Task (includes mention check for groups)
    const forceCapture = !chat.isGroup; // Force capture for allowed individual contacts
    const taskData = parseTask(msg.body, USER_NAME, forceCapture);
    
    if (!taskData) return;

    // 3. Complete task object
    const task = {
        id: Date.now().toString(),
        ...taskData,
        source: sourceName,
        status: 'pending'
    };

    console.log(`Task captured: "${task.taskText}" from ${task.source} for ${task.reminderTime.toLocaleString()}`);

    // 4. Persistence
    saveTask(task);

    // 5. Notify via Telegram
    await notifyTaskCaptured(task);

    // 6. Schedule Reminder
    scheduleReminder(task);
});

module.exports = { client };
