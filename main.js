document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Event listener for form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;

        // POST request to add a new task
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, dueDate })
        })
        .then(response => response.json())
        .then(addTaskToList)
        .catch(error => console.error('Error:', error));

        taskForm.reset();
    });

    // Function to add a task to the DOM
    function addTaskToList(task) {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p><p>Due: ${new Date(task.dueDate).toDateString()}</p>`;
        taskList.appendChild(div);
    }

    // Load existing tasks on page load
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => tasks.forEach(addTaskToList))
        .catch(error => console.error('Error:', error));
});


