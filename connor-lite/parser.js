const chrono = require('chrono-node');

/**
 * Extracts task text and parses reminder time from a message.
 * @param {string} text - The raw message text.
 * @param {string} userName - The name to filter for (e.g., "Abdul").
 * @param {boolean} forceCapture - If true, bypass the mention check.
 * @returns {object} { taskText, reminderTime }
 */
function parseTask(text, userName, forceCapture = false) {
    // 1. Check if user is mentioned
    const mentionRegex = new RegExp(`@?${userName}`, 'i');
    if (!forceCapture && !mentionRegex.test(text)) return null;

    // 2. Extract time using chrono-node
    const results = chrono.parse(text, new Date(), { forwardDate: true });
    let reminderTime = null;
    let taskText = text;

    if (results.length > 0) {
        reminderTime = results[0].start.date();
        // Remove the time-related part from the task text
        taskText = text.replace(results[0].text, '').trim();
    } else {
        // Default reminder: 1 hour later
        reminderTime = new Date(Date.now() + 60 * 60 * 1000);
    }

    // 3. Clean task text (remove mention)
    taskText = taskText.replace(mentionRegex, '').replace(/\s+/g, ' ').trim();

    return {
        taskText,
        reminderTime,
        originalMessage: text
    };
}

module.exports = { parseTask };
