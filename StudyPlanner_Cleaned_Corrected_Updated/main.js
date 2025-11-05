document.addEventListener('DOMContentLoaded', () => {
    const currentYear = document.getElementById('currentYear');
    const taskForm = document.getElementById('taskForm');
    const tasksList = document.getElementById('tasksList');
    const statusMessage = document.getElementById('statusMessage');

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    const setStatus = (message, isError = false) => {
        if (!statusMessage) {
            return;
        }

        statusMessage.textContent = message;
        statusMessage.classList.toggle('status--error', isError);
        statusMessage.hidden = false;
    };

    const clearStatus = () => {
        if (!statusMessage) {
            return;
        }

        statusMessage.hidden = true;
        statusMessage.textContent = '';
        statusMessage.classList.remove('status--error');
    };

    const createTaskElement = (task) => {
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');

        const title = document.createElement('h3');
        title.textContent = task.title;
        listItem.appendChild(title);

        if (task.description) {
            const description = document.createElement('p');
            description.textContent = task.description;
            listItem.appendChild(description);
        }

        const metadata = document.createElement('p');
        metadata.classList.add('task-meta');
        const dueDateText = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const priorityText = task.priority || 'Medium';
        metadata.textContent = `Due: ${dueDateText} • Priority: ${priorityText}`;
        listItem.appendChild(metadata);

        if (task.completed) {
            listItem.classList.add('task-item--completed');
        }

        return listItem;
    };

    const renderTasks = (tasks) => {
        if (!tasksList) {
            return;
        }

        tasksList.innerHTML = '';
        tasks.forEach((task) => {
            tasksList.appendChild(createTaskElement(task));
        });
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');

            if (!response.ok) {
                throw new Error('Unable to load tasks at this time.');
            }

            const payload = await response.json();
            const tasks = Array.isArray(payload) ? payload : payload.tasks || [];
            renderTasks(tasks);
            clearStatus();
        } catch (error) {
            console.error('Error loading tasks:', error);
            setStatus(error.message || 'Unable to load tasks at this time.', true);
        }
    };

    taskForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearStatus();

        const formData = new FormData(taskForm);
        const payload = {
            title: formData.get('title')?.toString().trim() || '',
            description: formData.get('description')?.toString().trim() || '',
            dueDate: formData.get('dueDate')
                ? new Date(formData.get('dueDate')).toISOString()
                : null,
            priority: formData.get('priority')?.toString() || 'Medium'
        };

        if (!payload.title) {
            setStatus('Please provide a task title before saving.', true);
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Unable to save the task.');
            }

            tasksList?.prepend(createTaskElement(data));
            taskForm.reset();
            setStatus('Task created successfully.');
        } catch (error) {
            console.error('Error creating task:', error);
            setStatus(error.message || 'Unable to save the task.', true);
        }
    });

    fetchTasks();
});
