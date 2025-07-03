document.addEventListener('DOMContentLoaded', () => {
    initTaskHandlers();
});

function initTaskHandlers() {
    const taskList = document.getElementById('taskList');
    const form = document.getElementById('taskFormElement');
    loadTasks(taskList);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const task = await sanitizeTaskForm();
        if (task) {
            try {
                const saved = await saveTask(task);
                addTaskToList(taskList, saved);
                form.reset();
            } catch (error) {
                console.error('Failed to create task:', error);
            }
        }
    });
}

// Load existing tasks from the server when the page loads.

async function loadTasks(taskList) {
    try {
        const stream = await fetch('/api/tasks');
        const tasks = await stream.json();
        tasks.forEach((t) => addTaskToList(taskList, t));
    } catch(error) {
        console.error('Failed to load tasks:', error);
    }
}

// Sanitize and validate form data
async function sanitizeTaskForm() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    if (!title || !description || !dueDate) {
        console.error('Invalid form data: title, description or due date is missing.');
        return null;
    }
    return {
        title,
        description,
        dueDate
    };
}

// Save task to the server via POST request.
async function saveTask(task) {
    const stream = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    return stream.json();
}

// Add task to list and render it on the page.
function addTaskToList(taskList, task) {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p><p>Due: ${new Date(task.dueDate).toDateString()}</p>`;
    taskList.appendChild(div);
}
