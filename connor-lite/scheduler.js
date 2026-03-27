const schedule = require('node-schedule');
const { notifyReminder } = require('./notifier');

const jobs = new Map();

function scheduleReminder(task) {
    const job = schedule.scheduleJob(task.reminderTime, async () => {
        console.log(`Triggering reminder for task: ${task.taskText}`);
        await notifyReminder(task);
        jobs.delete(task.id);
    });

    if (job) {
        jobs.set(task.id, job);
        console.log(`Scheduled reminder for ${task.reminderTime.toLocaleString()}`);
    }
}

module.exports = { scheduleReminder };
