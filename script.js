let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let hideCompleted = false;

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const categoryInput = document.getElementById('categoryInput');
    const priorityInput = document.getElementById('priorityInput');

    if (taskInput.value.trim() === '') {
        alert('Please enter a task');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskInput.value.trim(),
        dueDate: dueDateInput.value,
        category: categoryInput.value,
        priority: priorityInput.value,
        completed: false,
        important: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = '';
    dueDateInput.value = '';
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const filterCategory = document.getElementById('filterCategory').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    taskList.innerHTML = '';

    tasks
        .filter(task => (filterCategory === 'All' || task.category === filterCategory))
        .filter(task => task.text.toLowerCase().includes(searchInput))
        .filter(task => !hideCompleted || !task.completed)
        .forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            if (task.important) li.classList.add('important');

            const taskDetails = document.createElement('div');
            taskDetails.className = 'task-details';
            taskDetails.innerHTML = `<strong>${task.text}</strong> <small>[${task.category}] Due: ${task.dueDate || 'No date'} | Priority: ${task.priority}</small>`;

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';

            buttonGroup.append(
                createButton('✅', () => toggleComplete(task.id)),
                createButton('⭐', () => toggleImportant(task.id)),
                createButton('✏️', () => startEditTask(task.id)),
                createButton('🗑️', () => deleteTask(task.id))
            );

            li.append(taskDetails, buttonGroup);
            taskList.appendChild(li);
        });
}

function createButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function toggleImportant(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.important = !task.important;
        saveTasks();
        renderTasks();
    }
}

function startEditTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Edit task name:', task.text);
    const newDueDate = prompt('Edit due date (yyyy-mm-dd):', task.dueDate);
    const newCategory = prompt('Edit category:', task.category);
    const newPriority = prompt('Edit priority (Low, Medium, High):', task.priority);

    if (newText) task.text = newText.trim();
    if (newDueDate) task.dueDate = newDueDate;
    if (newCategory) task.category = newCategory;
    if (newPriority) task.priority = newPriority;

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

function sortTasks() {
    tasks.sort((a, b) => new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity));
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleCompletedTasks() {
    hideCompleted = !hideCompleted;
    document.getElementById('toggleCompletedButton').textContent = hideCompleted ? 'Show Completed' : 'Hide Completed';
    renderTasks();
}

function changeTheme() {
    const theme = document.getElementById('themeSelector').value;
    document.body.className = theme;
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
    document.getElementById('themeSelector').value = savedTheme;
}

window.onload = () => {
    loadTheme();
    renderTasks();
    document.getElementById('addTaskButton').addEventListener('click', addTask);
    document.getElementById('sortTasksButton').addEventListener('click', sortTasks);
    document.getElementById('filterCategory').addEventListener('change', renderTasks);
    document.getElementById('searchInput').addEventListener('input', renderTasks);
    document.getElementById('toggleCompletedButton').addEventListener('click', toggleCompletedTasks);
    document.getElementById('themeSelector').addEventListener('change', changeTheme);
};
