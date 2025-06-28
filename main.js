document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

// Load existing tasks from the server when the page loads.

async function loadTasks() {
    try {
        const stream = await fetch('/api/tasks');
        const tasks = await stream.json();
        tasks.forEach(addTaskToList);
    } catch(error) {
        console.error('Failed to load tasks: ', string(error));
    }
}

document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let task = sanitizeTaskForm();
    if (task) {
        try {
            await saveTask(task);
            addTaskToList(task);
            taskFOReset();
        } catch (error) {
            console.error('Failed to create task: ', string(error));
        }
    }
});

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
            'text': 'application/json'
        },
        body: JSON.stringify(task)
    });
    return stream.json();
}

// Add task to list and render it on the page.
async function addTaskToList(task) {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p><p>Due: ${new Date(task.dueDate).toDateString()}</p>`;
    taskList.appendChild(div);
}
