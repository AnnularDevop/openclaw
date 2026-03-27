const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.join(__dirname, 'tasks.json');

function loadTasks() {
    if (!fs.existsSync(STORAGE_PATH)) return [];
    try {
        const data = fs.readFileSync(STORAGE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

function saveTask(task) {
    const tasks = loadTasks();
    tasks.push(task);
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(tasks, null, 2));
}

module.exports = { loadTasks, saveTask };
