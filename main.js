document.addEventListener('DOMContentLoaded', () => {
  initTaskHandlers();
  initDiscoveryContactForm();
  initFooterSubscribeForm();
});

function initTaskHandlers() {
  const taskList = document.getElementById('taskList');
  const form = document.getElementById('taskFormElement');

  if (!taskList || !form) {
    return;
  }

  loadTasks(taskList);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const task = sanitizeTaskForm();

    if (!task) {
      return;
    }

    try {
      const savedTask = await saveTask(task);
      addTaskToList(taskList, savedTask || task);
      form.reset();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  });
}

async function loadTasks(taskList) {
  try {
    const response = await fetch('/api/tasks');

    if (!response.ok) {
      return;
    }

    const tasks = await response.json();

    if (Array.isArray(tasks)) {
      tasks.forEach((task) => addTaskToList(taskList, task));
    }
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
}

function sanitizeTaskForm() {
  const title = document.getElementById('taskTitle')?.value.trim();
  const description = document.getElementById('taskDescription')?.value.trim();
  const dueDate = document.getElementById('taskDueDate')?.value;

  if (!title || !description || !dueDate) {
    console.error('Invalid form data: title, description or due date is missing.');
    return null;
  }

  return { title, description, dueDate };
}

async function saveTask(task) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Task API request failed.');
  }

  return response.json();
}

function addTaskToList(taskList, task) {
  const taskCard = document.createElement('div');
  taskCard.innerHTML = `<h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.description)}</p><p>Due: ${new Date(task.dueDate).toDateString()}</p>`;
  taskList.appendChild(taskCard);
}

function initDiscoveryContactForm() {
  const form = document.getElementById('discoveryContactForm');
  const statusElement = document.getElementById('discoveryContactStatus');

  if (!form || !statusElement) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.name || !payload.email || !payload.goal || !payload.timeline || !payload.message) {
      setStatus(statusElement, 'Please complete every field before submitting.', true);
      return;
    }

    try {
      const response = await fetch('/api/discovery-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Contact endpoint failed.');
      }

      setStatus(statusElement, 'Thanks! Your discovery request has been submitted.');
      form.reset();
    } catch (error) {
      console.error('Discovery contact submission failed:', error);
      setStatus(statusElement, 'We could not submit your request. Please try again.', true);
    }
  });
}

function initFooterSubscribeForm() {
  const form = document.getElementById('footerSubscribeForm');
  const statusElement = document.getElementById('subscribeStatus');

  if (!form || !statusElement) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();

    if (!email) {
      setStatus(statusElement, 'Please enter an email address.', true);
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscribe endpoint failed.');
      }

      setStatus(statusElement, 'Subscribed! Check your inbox for updates.');
      form.reset();
    } catch (error) {
      console.error('Footer subscribe submission failed:', error);
      setStatus(statusElement, 'Subscription failed. Please try again.', true);
    }
  });
}

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.remove('success', 'error');
  element.classList.add(isError ? 'error' : 'success');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
