const selectors = {
    navToggle: document.querySelector('.nav-toggle'),
    navList: document.getElementById('primary-navigation'),
    taskForm: document.querySelector('[data-task-form]'),
    taskFeedback: document.querySelector('[data-task-feedback]'),
    taskList: document.querySelector('[data-task-list]'),
    taskEmpty: document.querySelector('[data-task-empty]'),
    taskFilters: document.querySelector('[data-task-filters]'),
    focusTimer: document.querySelector('[data-focus-timer]'),
    startTimerButton: document.querySelector('[data-start-timer]'),
    resetTimerButton: document.querySelector('[data-reset-timer]'),
    scheduleGrid: document.querySelector('[data-schedule-grid]'),
    scheduleTimeline: document.querySelector('[data-schedule-timeline]'),
    nextSessionTime: document.querySelector('[data-next-session-time]'),
    nextSessionSummary: document.querySelector('[data-next-session-summary]'),
    nextSessionChecklist: document.querySelector('[data-next-session-checklist]'),
    goalsGrid: document.querySelector('[data-goals-grid]'),
    resourcesGrid: document.querySelector('[data-resources-grid]'),
    analyticsTrends: document.querySelector('[data-analytics-trends]'),
    analyticsWins: document.querySelector('[data-analytics-wins]'),
    overviewFocus: document.querySelector('[data-overview-focus]'),
    overviewChecklist: document.querySelector('[data-overview-checklist]'),
    metricHours: document.querySelector('[data-metric-hours]'),
    metricDue: document.querySelector('[data-metric-due]'),
    metricMood: document.querySelector('[data-metric-mood]'),
    profileStreak: document.querySelector('[data-profile-streak]'),
    progressWeekly: document.querySelector('[data-progress-weekly]'),
    progressFocus: document.querySelector('[data-progress-focus]'),
    progressEnergy: document.querySelector('[data-progress-energy]'),
    currentYear: document.querySelector('[data-current-year]'),
    planSessionButton: document.querySelector('[data-plan-session]'),
    openSessionButton: document.querySelector('[data-open-session]'),
    syncCalendarButton: document.querySelector('[data-sync-calendar]'),
};

const PRIORITY_ORDER = {
    High: 1,
    Medium: 2,
    Low: 3,
};

const SAMPLE_TASKS = [
    {
        _id: 'sample-1',
        title: 'Complete database systems lab',
        description: 'Finish the ER diagram and update relational schemas.',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        priority: 'High',
        completed: false,
        tag: 'CS305',
    },
    {
        _id: 'sample-2',
        title: 'Revise calculus lecture 7',
        description: 'Summarise core proofs and build spaced repetition cards.',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
        priority: 'Medium',
        completed: false,
        tag: 'MATH221',
    },
    {
        _id: 'sample-3',
        title: 'Team stand-up notes',
        description: 'Record blockers for the capstone project sprint.',
        dueDate: null,
        priority: 'Low',
        completed: true,
        tag: 'Capstone',
    },
];

const SAMPLE_TIMELINE = [
    { time: '09:00', title: 'Deep work: Algorithms practice', duration: '90 min', location: 'Library study room 3' },
    { time: '13:30', title: 'Group lab sync', duration: '45 min', location: 'Zoom' },
    { time: '15:00', title: 'Peer tutoring session', duration: '60 min', location: 'Learning commons' },
    { time: '19:00', title: 'Reflection & planning', duration: '30 min', location: 'Desk' },
];

const SAMPLE_SCHEDULE_GRID = [
    { day: 'Mon', focus: 'Systems lab', duration: '2h', context: 'Campus lab' },
    { day: 'Tue', focus: 'Algorithms drills', duration: '1.5h', context: 'Library' },
    { day: 'Wed', focus: 'Research outline', duration: '2h', context: 'Home office' },
    { day: 'Thu', focus: 'Statistics review', duration: '1h', context: 'Learning hub' },
    { day: 'Fri', focus: 'Capstone sync', duration: '1h', context: 'Studio' },
    { day: 'Sat', focus: 'Rest & reflect', duration: '—', context: 'Recharge' },
    { day: 'Sun', focus: 'Weekly planning', duration: '45m', context: 'Cafe' },
];

const SAMPLE_GOALS = [
    {
        title: 'Submit research proposal draft',
        description: 'Prepare draft one with annotated bibliography and timeline.',
        progress: 65,
        due: 'Due in 5 days',
        focus: 'Research methods',
    },
    {
        title: 'Achieve 10-hour focus streak',
        description: 'Log consistent focus blocks across the next 7 days.',
        progress: 40,
        due: 'Track daily',
        focus: 'Productivity',
    },
    {
        title: 'Refine interview portfolio',
        description: 'Update case study #2 and record 2 mock interviews.',
        progress: 30,
        due: 'Complete by next Friday',
        focus: 'Career prep',
    },
];

const SAMPLE_RESOURCES = [
    {
        title: 'SQL practice workbook',
        description: 'Targeted query drills with spaced repetition prompts.',
        link: 'https://www.sql-practice.com',
        category: 'Practice',
    },
    {
        title: 'Metacognition strategies',
        description: 'Five evidence-based strategies to boost retention.',
        link: 'https://learninglab.edu/metacognition',
        category: 'Skill building',
    },
    {
        title: 'Pomodoro playlist',
        description: 'Curated lofi tracks optimised for deep work blocks.',
        link: 'https://open.spotify.com/playlist/xxxx',
        category: 'Focus',
    },
];

const SAMPLE_TRENDS = [
    'You maintained a 12-day study streak—keep the momentum going!',
    'Average focus session length increased to 68 minutes (up 12%).',
    'Energy dips between 2-3pm; consider lighter tasks during that window.',
];

const SAMPLE_WINS = [
    'Database systems lab submitted one day ahead of deadline.',
    'Completed two peer-led study sessions this week.',
    'Successfully taught calculus concepts in tutoring session—solid mastery.',
];

const state = {
    tasks: [],
    filters: {
        status: 'all',
        priority: 'all',
        sort: 'dueDate',
    },
    timer: {
        totalSeconds: 25 * 60,
        remainingSeconds: 25 * 60,
        intervalId: null,
    },
};

const normaliseTask = (task) => ({
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    priority: task.priority || 'Medium',
    completed: Boolean(task.completed),
    tag: task.tag || task.category || 'General',
    _id: task._id || task.id || `local-${Date.now()}`,
});

const formatDate = (date) => {
    if (!date) {
        return 'No due date';
    }
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
    }).format(date);
};

const formatDateDetailed = (date) => {
    if (!date) {
        return 'No due date';
    }
    return new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

const toggleNavigation = () => {
    if (!selectors.navToggle || !selectors.navList) {
        return;
    }
    const isOpen = selectors.navToggle.getAttribute('aria-expanded') === 'true';
    selectors.navToggle.setAttribute('aria-expanded', String(!isOpen));
    selectors.navList.dataset.open = (!isOpen).toString();
};

const bindNavigation = () => {
    if (!selectors.navToggle || !selectors.navList) {
        return;
    }
    selectors.navToggle.addEventListener('click', toggleNavigation);
    selectors.navList.addEventListener('click', (event) => {
        if (event.target instanceof HTMLElement && event.target.tagName === 'A') {
            selectors.navToggle.setAttribute('aria-expanded', 'false');
            selectors.navList.dataset.open = 'false';
        }
    });
};

const showFeedback = (message, tone = 'info') => {
    if (!selectors.taskFeedback) {
        return;
    }
    selectors.taskFeedback.textContent = message;
    selectors.taskFeedback.dataset.tone = tone;
};

const applyFilters = () => {
    const filtered = state.tasks.filter((task) => {
        let matches = true;
        if (state.filters.status === 'open') {
            matches = matches && !task.completed;
        } else if (state.filters.status === 'completed') {
            matches = matches && task.completed;
        }
        if (state.filters.priority !== 'all') {
            matches = matches && task.priority === state.filters.priority;
        }
        return matches;
    });

    const sorted = filtered.sort((a, b) => {
        switch (state.filters.sort) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'priority':
                return (PRIORITY_ORDER[a.priority] || 99) - (PRIORITY_ORDER[b.priority] || 99);
            case 'dueDate':
            default:
                if (!a.dueDate && !b.dueDate) {
                    return 0;
                }
                if (!a.dueDate) {
                    return 1;
                }
                if (!b.dueDate) {
                    return -1;
                }
                return a.dueDate.getTime() - b.dueDate.getTime();
        }
    });

    return sorted;
};

const renderTasks = () => {
    if (!selectors.taskList || !selectors.taskEmpty) {
        return;
    }

    const tasksToRender = applyFilters();
    selectors.taskList.innerHTML = '';

    if (tasksToRender.length === 0) {
        selectors.taskEmpty.hidden = false;
        updateMetrics();
        return;
    }

    selectors.taskEmpty.hidden = true;
    const template = document.getElementById('task-item-template');

    tasksToRender.forEach((task) => {
        if (!(template instanceof HTMLTemplateElement)) {
            return;
        }
        const element = template.content.firstElementChild.cloneNode(true);
        const title = element.querySelector('[data-task-title]');
        const description = element.querySelector('[data-task-description]');
        const due = element.querySelector('[data-task-due]');
        const priority = element.querySelector('[data-task-priority]');
        const tag = element.querySelector('[data-task-tag]');
        const checkbox = element.querySelector('[data-task-complete]');
        const deleteButton = element.querySelector('[data-task-delete]');

        if (title) {
            title.textContent = task.title;
        }
        if (description) {
            description.textContent = task.description || 'No additional details provided yet.';
        }
        if (due) {
            due.textContent = formatDateDetailed(task.dueDate);
        }
        if (priority) {
            priority.textContent = `• ${task.priority} priority`;
        }
        if (tag) {
            tag.textContent = task.tag || 'General';
        }
        if (checkbox instanceof HTMLInputElement) {
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => updateTaskCompletion(task._id, checkbox.checked));
        }
        if (deleteButton) {
            deleteButton.addEventListener('click', () => deleteTask(task._id));
        }

        selectors.taskList.appendChild(element);
    });

    updateMetrics();
};

const updateMetrics = () => {
    const completedTasks = state.tasks.filter((task) => task.completed);
    const openAssignments = state.tasks.length - completedTasks.length;
    const totalMinutes = completedTasks.reduce(
        (sum, task) => sum + (task.estimatedMinutes ?? 90),
        0
    );
    const focusHours = (totalMinutes / 60).toFixed(1);
    const completionRate = state.tasks.length
        ? Math.min(100, Math.round((completedTasks.length / state.tasks.length) * 100))
        : 0;
    const focusConsistency = state.tasks.length
        ? Math.min(100, Math.round((completedTasks.length / state.tasks.length) * 120))
        : 40;
    const energyLevel = Math.max(20, Math.min(100, 90 - openAssignments * 8));
    const moodIcon = energyLevel > 70 ? '😄' : energyLevel > 50 ? '😊' : energyLevel > 30 ? '🙂' : '😅';
    const streak = Math.max(5, Math.min(30, 10 + completedTasks.length));

    if (selectors.metricHours) {
        selectors.metricHours.textContent = `${focusHours}h`;
    }
    if (selectors.metricDue) {
        selectors.metricDue.textContent = String(openAssignments);
    }
    if (selectors.metricMood) {
        selectors.metricMood.textContent = moodIcon;
    }
    if (selectors.profileStreak) {
        selectors.profileStreak.textContent = String(streak);
    }

    const setProgress = (barElement, value) => {
        if (!barElement) {
            return;
        }
        const clamped = Math.max(0, Math.min(100, value));
        barElement.style.width = `${clamped}%`;
        const progressContainer = barElement.parentElement;
        if (progressContainer) {
            progressContainer.setAttribute('aria-valuenow', clamped.toString());
        }
        const valueElement = progressContainer?.nextElementSibling;
        if (valueElement) {
            valueElement.textContent = `${clamped}%`;
        }
    };

    setProgress(selectors.progressWeekly, completionRate);
    setProgress(selectors.progressFocus, focusConsistency);
    setProgress(selectors.progressEnergy, energyLevel);
};

const updateTaskCompletion = async (taskId, completed) => {
    const task = state.tasks.find((item) => item._id === taskId);
    if (task) {
        task.completed = completed;
    }
    renderTasks();

    try {
        await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });
    } catch (error) {
        console.warn('Unable to sync task completion, will retry later.', error);
        showFeedback('Offline mode: completion will sync when you reconnect.', 'warning');
    }
};

const deleteTask = async (taskId) => {
    state.tasks = state.tasks.filter((task) => task._id !== taskId);
    renderTasks();

    try {
        await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        showFeedback('Task removed.', 'success');
    } catch (error) {
        console.warn('Unable to delete task from API, removed locally instead.', error);
        showFeedback('Removed locally. Sign in to sync deletions.', 'warning');
    }
};

const handleTaskSubmit = async (event) => {
    event.preventDefault();
    if (!selectors.taskForm) {
        return;
    }
    const formData = new FormData(selectors.taskForm);
    const payload = {
        title: formData.get('title')?.toString().trim() ?? '',
        description: formData.get('description')?.toString().trim() ?? '',
        dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate')) : null,
        priority: formData.get('priority')?.toString() || 'Medium',
    };

    if (!payload.title) {
        showFeedback('Add a task title to keep things organised.', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: payload.title,
                description: payload.description,
                priority: payload.priority,
                dueDate: payload.dueDate ? payload.dueDate.toISOString() : undefined,
            }),
        });

        if (!response.ok) {
            throw new Error(`Unexpected response ${response.status}`);
        }

        const createdTask = await response.json();
        state.tasks.unshift(normaliseTask(createdTask));
        showFeedback('Task saved and synced.', 'success');
    } catch (error) {
        console.warn('Falling back to offline task storage', error);
        const offlineTask = normaliseTask({
            ...payload,
            completed: false,
            _id: `local-${Date.now()}`,
        });
        state.tasks.unshift(offlineTask);
        showFeedback('Saved locally. Sign in later to sync your tasks.', 'warning');
    }

    selectors.taskForm.reset();
    renderTasks();
};

const bindTaskForm = () => {
    if (!selectors.taskForm) {
        return;
    }
    selectors.taskForm.addEventListener('submit', handleTaskSubmit);
    selectors.taskForm.addEventListener('reset', () => showFeedback('Form cleared.', 'info'));
};

const bindTaskFilters = () => {
    if (!selectors.taskFilters) {
        return;
    }
    selectors.taskFilters.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement)) {
            return;
        }
        const { name, value } = target;
        state.filters[name] = value;
        renderTasks();
    });
};

const fetchTasks = async () => {
    if (!selectors.taskList) {
        return;
    }

    selectors.taskList.setAttribute('aria-busy', 'true');
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
            throw new Error('Unable to fetch tasks from API');
        }
        const tasks = await response.json();
        state.tasks = tasks.map(normaliseTask);
        showFeedback('Tasks loaded from your workspace.', 'success');
    } catch (error) {
        console.warn('Falling back to sample tasks', error);
        if (state.tasks.length === 0) {
            state.tasks = SAMPLE_TASKS.map(normaliseTask);
        }
        showFeedback('You are viewing sample tasks. Connect your account to sync.', 'warning');
    } finally {
        selectors.taskList.setAttribute('aria-busy', 'false');
        renderTasks();
    }
};

const renderTimeline = () => {
    if (!selectors.scheduleTimeline) {
        return;
    }
    selectors.scheduleTimeline.innerHTML = '';
    SAMPLE_TIMELINE.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>
                <strong>${item.title}</strong>
                <p>${item.location}</p>
            </div>
            <div>
                <time datetime="${item.time}">${item.time}</time>
                <span>${item.duration}</span>
            </div>
        `;
        selectors.scheduleTimeline.appendChild(listItem);
    });
};

const renderScheduleGrid = () => {
    if (!selectors.scheduleGrid) {
        return;
    }
    selectors.scheduleGrid.innerHTML = '';
    SAMPLE_SCHEDULE_GRID.forEach((slot) => {
        const cell = document.createElement('article');
        cell.className = 'schedule__cell';
        cell.innerHTML = `
            <strong>${slot.day}</strong>
            <span>${slot.focus}</span>
            <small>${slot.duration}</small>
            <small>${slot.context}</small>
        `;
        selectors.scheduleGrid.appendChild(cell);
    });
};

const renderGoals = () => {
    if (!selectors.goalsGrid) {
        return;
    }
    selectors.goalsGrid.innerHTML = '';
    SAMPLE_GOALS.forEach((goal) => {
        const element = document.createElement('article');
        element.className = 'goal';
        element.innerHTML = `
            <h3 class="goal__title">${goal.title}</h3>
            <p>${goal.description}</p>
            <div class="goal__progress">
                <span>${goal.due}</span>
                <span>${goal.progress}%</span>
            </div>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${goal.progress}">
                <span class="progress__bar" style="width: ${goal.progress}%"></span>
            </div>
            <span class="task__tag">${goal.focus}</span>
        `;
        selectors.goalsGrid.appendChild(element);
    });
};

const renderResources = () => {
    if (!selectors.resourcesGrid) {
        return;
    }
    selectors.resourcesGrid.innerHTML = '';
    SAMPLE_RESOURCES.forEach((resource) => {
        const element = document.createElement('article');
        element.className = 'resource';
        element.innerHTML = `
            <h3 class="resource__title">${resource.title}</h3>
            <p>${resource.description}</p>
            <a class="resource__link" href="${resource.link}" target="_blank" rel="noreferrer">Visit resource</a>
            <span class="task__tag">${resource.category}</span>
        `;
        selectors.resourcesGrid.appendChild(element);
    });
};

const renderAnalytics = () => {
    if (selectors.analyticsTrends) {
        selectors.analyticsTrends.innerHTML = '';
        SAMPLE_TRENDS.forEach((trend) => {
            const item = document.createElement('li');
            item.textContent = trend;
            selectors.analyticsTrends.appendChild(item);
        });
    }
    if (selectors.analyticsWins) {
        selectors.analyticsWins.innerHTML = '';
        SAMPLE_WINS.forEach((win) => {
            const item = document.createElement('li');
            item.textContent = win;
            selectors.analyticsWins.appendChild(item);
        });
    }
};

const populateOverview = () => {
    if (selectors.overviewFocus) {
        selectors.overviewFocus.textContent = 'Prioritise completing the systems lab deliverable today.';
    }
    if (selectors.overviewChecklist) {
        selectors.overviewChecklist.innerHTML = '';
        ['Outline research questions', 'Draft ER diagram', 'Schedule peer review'].forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            selectors.overviewChecklist.appendChild(li);
        });
    }
    if (selectors.metricMood) {
        selectors.metricMood.textContent = '😊';
    }
};

const bindQuickActions = () => {
    const quickButtons = [
        selectors.planSessionButton,
        selectors.openSessionButton,
        selectors.syncCalendarButton,
    ].filter(Boolean);

    quickButtons.forEach((button) => {
        button.addEventListener('click', () => {
            showFeedback('Feature coming soon. Your workspace layout is ready for integration.', 'info');
        });
    });
};

const updateTimerDisplay = () => {
    if (!selectors.focusTimer) {
        return;
    }
    const minutes = Math.floor(state.timer.remainingSeconds / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (state.timer.remainingSeconds % 60).toString().padStart(2, '0');
    selectors.focusTimer.textContent = `${minutes}:${seconds}`;
};

const startTimer = () => {
    if (state.timer.intervalId !== null) {
        return;
    }
    state.timer.intervalId = window.setInterval(() => {
        if (state.timer.remainingSeconds <= 0) {
            clearInterval(state.timer.intervalId);
            state.timer.intervalId = null;
            showFeedback('Focus block complete—log your wins!', 'success');
            return;
        }
        state.timer.remainingSeconds -= 1;
        updateTimerDisplay();
    }, 1000);
};

const resetTimer = () => {
    if (state.timer.intervalId !== null) {
        clearInterval(state.timer.intervalId);
        state.timer.intervalId = null;
    }
    state.timer.remainingSeconds = state.timer.totalSeconds;
    updateTimerDisplay();
};

const bindTimerControls = () => {
    if (selectors.startTimerButton) {
        selectors.startTimerButton.addEventListener('click', startTimer);
    }
    if (selectors.resetTimerButton) {
        selectors.resetTimerButton.addEventListener('click', resetTimer);
    }
    updateTimerDisplay();
};

const hydrateStaticSections = () => {
    renderTimeline();
    renderScheduleGrid();
    renderGoals();
    renderResources();
    renderAnalytics();
    populateOverview();
};

const setCurrentYear = () => {
    if (selectors.currentYear) {
        selectors.currentYear.textContent = new Date().getFullYear().toString();
    }
};

const init = () => {
    bindNavigation();
    bindTaskForm();
    bindTaskFilters();
    bindTimerControls();
    bindQuickActions();
    hydrateStaticSections();
    setCurrentYear();
    fetchTasks();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
