const { client } = require('./observer');
const { loadTasks } = require('./storage');
const { scheduleReminder } = require('./scheduler');

console.log('Starting Connor Lite...');

// Re-schedule pending tasks on startup
const tasks = loadTasks();
const now = new Date();

tasks.filter(t => t.status === 'pending' && new Date(t.reminderTime) > now).forEach(task => {
    console.log(`Re-scheduling pending task: ${task.taskText}`);
    scheduleReminder({ ...task, reminderTime: new Date(task.reminderTime) });
});

client.initialize();
