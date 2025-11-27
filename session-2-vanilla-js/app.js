/**
 * SESSION 2 - VANILLA JAVASCRIPT CONCEPTS
 *
 * This file demonstrates:
 * 1. DOM Manipulation - Creating and modifying elements
 * 2. Event Handling - Click, input, submit events
 * 3. Event Delegation - Efficient event handling for dynamic content
 * 4. Fetch API - Loading data from external sources
 * 5. Async/Await - Modern JavaScript async patterns
 * 6. LocalStorage - Persisting data in the browser
 * 7. Array Methods - filter, map, reduce, find, sort
 * 8. Template Literals - Dynamic HTML generation
 * 9. Destructuring - Modern JavaScript syntax
 * 10. Modules Pattern - Organizing code
 */

// ============================================
// APPLICATION STATE
// ============================================
// In a real backend app, this would be your database
// Here, it's an in-memory object that holds all application data

const AppState = {
    tasks: [],
    filters: {
        status: 'all',      // 'all', 'pending', 'completed'
        priority: 'all',    // 'all', 'high', 'medium', 'low'
        searchTerm: ''
    },
    sortBy: 'date',         // 'date', 'priority', 'title'
    currentEditingTaskId: null
};

// ============================================
// DATA MANAGEMENT
// ============================================

/**
 * Load tasks from localStorage or use sample data
 * Think of localStorage as a simple key-value database in the browser
 */
function loadTasks() {
    const stored = localStorage.getItem('taskmaster-tasks');

    if (stored) {
        // If we have stored tasks, parse them from JSON
        AppState.tasks = JSON.parse(stored);
    } else {
        // Otherwise, use sample data (good for first-time users)
        AppState.tasks = getSampleTasks();
        saveTasks(); // Save the sample data
    }
}

/**
 * Save tasks to localStorage
 * JSON.stringify converts JavaScript objects to JSON strings
 */
function saveTasks() {
    localStorage.setItem('taskmaster-tasks', JSON.stringify(AppState.tasks));
}

/**
 * Generate sample tasks for demonstration
 * In a real app, this would come from an API
 */
function getSampleTasks() {
    return [
        {
            id: 1,
            title: 'Fix authentication bug in login flow',
            description: 'Users are experiencing issues logging in with OAuth providers. Need to debug the callback handling.',
            priority: 'high',
            status: 'pending',
            dueDate: '2024-12-25',
            createdAt: new Date('2024-12-20').toISOString()
        },
        {
            id: 2,
            title: 'Update API documentation',
            description: 'Add examples for the new endpoints and update the authentication section.',
            priority: 'medium',
            status: 'pending',
            dueDate: '2024-12-28',
            createdAt: new Date('2024-12-21').toISOString()
        },
        {
            id: 3,
            title: 'Refactor user service tests',
            description: 'Clean up test code and add missing edge cases for better coverage.',
            priority: 'low',
            status: 'pending',
            dueDate: '2025-01-05',
            createdAt: new Date('2024-12-22').toISOString()
        },
        {
            id: 4,
            title: 'Implement user profile page',
            description: 'Create responsive profile page with edit functionality and avatar upload.',
            priority: 'high',
            status: 'completed',
            dueDate: '2024-12-20',
            completedAt: new Date('2024-12-20').toISOString(),
            createdAt: new Date('2024-12-15').toISOString()
        }
    ];
}

// ============================================
// CRUD OPERATIONS (Create, Read, Update, Delete)
// ============================================
// These are the same operations you'd have in a backend service

/**
 * Create a new task
 * @param {Object} taskData - The task data to create
 * @returns {Object} The created task with generated ID
 */
function createTask(taskData) {
    const newTask = {
        id: Date.now(), // Simple ID generation using timestamp
        ...taskData,    // Spread operator: copies all properties from taskData
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    AppState.tasks.push(newTask);
    saveTasks();
    return newTask;
}

/**
 * Update an existing task
 * @param {number} taskId - The ID of the task to update
 * @param {Object} updates - The properties to update
 * @returns {Object|null} The updated task or null if not found
 */
function updateTask(taskId, updates) {
    // Array.findIndex() returns the index of the first element that matches
    const index = AppState.tasks.findIndex(task => task.id === taskId);

    if (index === -1) return null;

    // Merge the updates with the existing task
    AppState.tasks[index] = {
        ...AppState.tasks[index],
        ...updates
    };

    saveTasks();
    return AppState.tasks[index];
}

/**
 * Delete a task
 * @param {number} taskId - The ID of the task to delete
 * @returns {boolean} True if deleted, false if not found
 */
function deleteTask(taskId) {
    const initialLength = AppState.tasks.length;
    // Array.filter() creates a new array with all elements that pass the test
    AppState.tasks = AppState.tasks.filter(task => task.id !== taskId);

    if (AppState.tasks.length !== initialLength) {
        saveTasks();
        return true;
    }
    return false;
}

/**
 * Toggle task completion status
 * @param {number} taskId - The ID of the task to toggle
 */
function toggleTaskCompletion(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);

    if (!task) return;

    if (task.status === 'completed') {
        // Uncomplete the task
        updateTask(taskId, {
            status: 'pending',
            completedAt: null
        });
    } else {
        // Complete the task
        updateTask(taskId, {
            status: 'completed',
            completedAt: new Date().toISOString()
        });
    }
}

/**
 * Clear all completed tasks
 */
function clearCompletedTasks() {
    AppState.tasks = AppState.tasks.filter(task => task.status !== 'completed');
    saveTasks();
}

// ============================================
// DATA FILTERING & SORTING
// ============================================

/**
 * Get filtered and sorted tasks based on current AppState
 * This demonstrates chaining array methods - common in functional programming
 * @returns {Array} Filtered and sorted tasks
 */
function getFilteredTasks() {
    let result = [...AppState.tasks]; // Create a copy to avoid mutating original

    // Filter by status
    if (AppState.filters.status !== 'all') {
        result = result.filter(task => task.status === AppState.filters.status);
    }

    // Filter by priority
    if (AppState.filters.priority !== 'all') {
        result = result.filter(task => task.priority === AppState.filters.priority);
    }

    // Filter by search term (case-insensitive)
    if (AppState.filters.searchTerm) {
        const searchLower = AppState.filters.searchTerm.toLowerCase();
        result = result.filter(task =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
        );
    }

    // Sort the results
    result = sortTasks(result, AppState.sortBy);

    return result;
}

/**
 * Sort tasks based on criteria
 * @param {Array} tasks - Tasks to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted tasks
 */
function sortTasks(tasks, sortBy) {
    const sorted = [...tasks]; // Create a copy

    switch (sortBy) {
        case 'priority':
            // Custom sort: high > medium > low
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            break;

        case 'title':
            // Alphabetical sort
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;

        case 'date':
        default:
            // Sort by due date (newest first)
            sorted.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
    }

    return sorted;
}

/**
 * Calculate statistics from tasks
 * Uses Array.reduce() - a powerful method for aggregating data
 * @returns {Object} Statistics object
 */
function calculateStats() {
    const stats = AppState.tasks.reduce((acc, task) => {
        acc.total++;

        if (task.status === 'completed') {
            acc.completed++;
        } else {
            acc.inProgress++;
        }

        return acc;
    }, { total: 0, inProgress: 0, completed: 0 });

    // Calculate completion rate as percentage
    stats.completionRate = stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;

    return stats;
}

// ============================================
// DOM MANIPULATION - RENDERING FUNCTIONS
// ============================================

/**
 * Render statistics cards
 * Demonstrates: innerHTML, template literals, dynamic data
 */
function renderStats() {
    const stats = calculateStats();
    const statsSection = document.getElementById('stats-section');

    // Using template literals to create HTML
    // This is cleaner than concatenating strings
    statsSection.innerHTML = `
        <div class="stat-card fade-in">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
                <h3>Total Tasks</h3>
                <p class="stat-number">${stats.total}</p>
            </div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
                <h3>In Progress</h3>
                <p class="stat-number">${stats.inProgress}</p>
            </div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-icon">✨</div>
            <div class="stat-content">
                <h3>Completed</h3>
                <p class="stat-number">${stats.completed}</p>
            </div>
        </div>
        <div class="stat-card fade-in">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
                <h3>Completion Rate</h3>
                <p class="stat-number">${stats.completionRate}%</p>
            </div>
        </div>
    `;
}

/**
 * Render filter sidebar
 * Demonstrates: dynamic list generation, data attributes
 */
function renderFilters() {
    // Status filters
    const statusFilters = document.getElementById('status-filters');
    const statusData = [
        { value: 'all', icon: '📋', label: 'All Tasks' },
        { value: 'pending', icon: '⏰', label: 'Pending' },
        { value: 'completed', icon: '✅', label: 'Completed' }
    ];

    statusFilters.innerHTML = statusData.map(filter => {
        const count = filter.value === 'all'
            ? AppState.tasks.length
            : AppState.tasks.filter(t => t.status === filter.value).length;

        const isActive = AppState.filters.status === filter.value ? 'active' : '';

        return `
            <li class="filter-item ${isActive}" data-filter-type="status" data-filter-value="${filter.value}">
                <span class="filter-icon">${filter.icon}</span>
                <span>${filter.label}</span>
                <span class="badge">${count}</span>
            </li>
        `;
    }).join('');

    // Priority filters
    const priorityFilters = document.getElementById('priority-filters');
    const priorityData = [
        { value: 'high', class: 'high', label: 'High Priority' },
        { value: 'medium', class: 'medium', label: 'Medium Priority' },
        { value: 'low', class: 'low', label: 'Low Priority' }
    ];

    priorityFilters.innerHTML = priorityData.map(filter => {
        const count = AppState.tasks.filter(t => t.priority === filter.value).length;
        const isActive = AppState.filters.priority === filter.value ? 'active' : '';

        return `
            <li class="filter-item ${isActive}" data-filter-type="priority" data-filter-value="${filter.value}">
                <span class="priority-dot ${filter.class}"></span>
                <span>${filter.label}</span>
                <span class="badge">${count}</span>
            </li>
        `;
    }).join('');
}

/**
 * Create a task card element
 * Demonstrates: Creating elements programmatically (more efficient than innerHTML for individual items)
 * @param {Object} task - Task data
 * @returns {HTMLElement} Task card element
 */
function createTaskCard(task) {
    // Create the card container
    const card = document.createElement('article');
    card.className = `task-card fade-in ${task.status === 'completed' ? 'completed' : ''}`;
    card.dataset.taskId = task.id; // data attributes for easy reference

    // Format the due date nicely
    const dueDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'No due date';

    // Determine date label (Due vs Completed)
    const dateLabel = task.status === 'completed'
        ? `📅 Completed: ${new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : `📅 Due: ${dueDate}`;

    // Set the HTML content
    card.innerHTML = `
        <div class="task-header">
            <span class="priority-badge ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
            <button class="btn-icon" data-action="menu">⋯</button>
        </div>
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">${task.description}</p>
        <div class="task-meta">
            <span class="task-date">${dateLabel}</span>
            <span class="task-status ${task.status}">${task.status === 'completed' ? '✓ Completed' : 'Pending'}</span>
        </div>
        <div class="task-footer">
            ${task.status === 'pending' ? `
                <button class="btn btn-small btn-primary" data-action="complete">Complete</button>
                <button class="btn btn-small btn-secondary" data-action="edit">Edit</button>
            ` : `
                <button class="btn btn-small btn-secondary" data-action="uncomplete">Reopen</button>
            `}
            <button class="btn btn-small btn-secondary" data-action="delete">Delete</button>
        </div>
    `;

    return card;
}

/**
 * Render all task cards
 * Demonstrates: DocumentFragment for efficient DOM manipulation
 */
function renderTasks() {
    const taskGrid = document.getElementById('task-grid');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const emptyState = document.getElementById('empty-state');

    // Hide all states first
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    emptyState.style.display = 'none';

    // Get filtered tasks
    const tasks = getFilteredTasks();

    // Clear existing content
    taskGrid.innerHTML = '';

    // Show empty state if no tasks
    if (tasks.length === 0) {
        if (AppState.tasks.length === 0) {
            emptyState.style.display = 'flex';
        } else {
            // No results from filtering
            taskGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-secondary);">No tasks match your filters.</p>';
        }
        return;
    }

    // Using DocumentFragment for better performance
    // Instead of adding elements one by one (causing multiple reflows),
    // we build everything in memory first, then add it all at once
    const fragment = document.createDocumentFragment();

    tasks.forEach(task => {
        const card = createTaskCard(task);
        fragment.appendChild(card);
    });

    taskGrid.appendChild(fragment);
}

/**
 * Show loading state
 */
function showLoading() {
    document.getElementById('loading-state').style.display = 'flex';
    document.getElementById('task-grid').innerHTML = '';
}

/**
 * Show error state
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorState = document.getElementById('error-state');
    errorState.style.display = 'flex';
    errorState.querySelector('.error-message').textContent = message;
    document.getElementById('task-grid').innerHTML = '';
}

/**
 * Render the entire UI
 * This is our main render function that updates everything
 */
function render() {
    renderStats();
    renderFilters();
    renderTasks();
}

// ============================================
// MODAL MANAGEMENT
// ============================================

/**
 * Open the task modal for creating or editing
 * @param {number|null} taskId - Task ID for editing, null for creating
 */
function openTaskModal(taskId = null) {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('task-form');

    // Store which task we're editing
    AppState.currentEditingTaskId = taskId;

    if (taskId) {
        // Edit mode
        const task = AppState.tasks.find(t => t.id === taskId);
        if (!task) return;

        modalTitle.textContent = 'Edit Task';
        submitBtn.textContent = 'Update Task';

        // Populate form with existing data
        document.getElementById('task-title-input').value = task.title;
        document.getElementById('task-description-input').value = task.description;
        document.getElementById('task-priority-input').value = task.priority;
        document.getElementById('task-due-date-input').value = task.dueDate || '';
    } else {
        // Create mode
        modalTitle.textContent = 'Create New Task';
        submitBtn.textContent = 'Create Task';
        form.reset(); // Clear the form
    }

    // Show the modal
    modal.style.display = 'flex';

    // Focus the first input for better UX
    document.getElementById('task-title-input').focus();
}

/**
 * Close the task modal
 */
function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    modal.style.display = 'none';
    AppState.currentEditingTaskId = null;
    document.getElementById('task-form').reset();
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handle task form submission
 * @param {Event} e - Form submit event
 */
function handleTaskFormSubmit(e) {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Get form data using FormData API (modern way)
    const formData = new FormData(e.target);
    const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate')
    };

    if (AppState.currentEditingTaskId) {
        // Update existing task
        updateTask(AppState.currentEditingTaskId, taskData);
    } else {
        // Create new task
        createTask(taskData);
    }

    // Close modal and re-render
    closeTaskModal();
    render();
}

/**
 * Handle filter click
 * @param {Event} e - Click event
 */
function handleFilterClick(e) {
    const filterItem = e.target.closest('.filter-item');
    if (!filterItem) return;

    const filterType = filterItem.dataset.filterType;
    const filterValue = filterItem.dataset.filterValue;

    // Update filter state
    AppState.filters[filterType] = filterValue;

    // Re-render
    render();
}

/**
 * Handle search input
 * Demonstrates: Debouncing (good practice for performance)
 * We don't want to filter on every keystroke - wait until user stops typing
 */
let searchTimeout;
function handleSearch(e) {
    clearTimeout(searchTimeout); // Clear previous timeout

    searchTimeout = setTimeout(() => {
        AppState.filters.searchTerm = e.target.value.trim();
        render();
    }, 300); // Wait 300ms after user stops typing
}

/**
 * Handle sort change
 * @param {Event} e - Change event
 */
function handleSortChange(e) {
    AppState.sortBy = e.target.value;
    render();
}

/**
 * Handle task card actions (edit, delete, complete, etc.)
 * Demonstrates: Event Delegation - We add ONE listener to the parent,
 * instead of adding listeners to every button
 * @param {Event} e - Click event
 */
function handleTaskAction(e) {
    // Find the button that was clicked
    const button = e.target.closest('[data-action]');
    if (!button) return;

    // Find the card to get the task ID
    const card = button.closest('[data-task-id]');
    if (!card) return;

    const taskId = parseInt(card.dataset.taskId);
    const action = button.dataset.action;

    // Handle different actions
    switch (action) {
        case 'edit':
            openTaskModal(taskId);
            break;

        case 'delete':
            // Show confirmation before deleting
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId);
                render();
            }
            break;

        case 'complete':
        case 'uncomplete':
            toggleTaskCompletion(taskId);
            render();
            break;
    }
}

// ============================================
// ASYNC DATA FETCHING (BONUS)
// ============================================

/**
 * Fetch tasks from an API (demonstration)
 * This shows how you'd integrate with a real backend
 * Demonstrates: async/await, try/catch, fetch API
 */
async function fetchTasksFromAPI() {
    try {
        // Show loading state
        showLoading();

        // Fetch from JSONPlaceholder (free API for testing)
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');

        // Check if response is OK (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response
        const todos = await response.json();

        // Transform the API data to our format
        const transformedTasks = todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            description: 'Fetched from API',
            priority: 'medium',
            status: todo.completed ? 'completed' : 'pending',
            dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            completedAt: todo.completed ? new Date().toISOString() : null
        }));

        // Add to our tasks
        AppState.tasks = [...AppState.tasks, ...transformedTasks];
        saveTasks();

        // Re-render
        render();

    } catch (error) {
        // Handle errors gracefully
        console.error('Failed to fetch tasks:', error);
        showError(`Failed to fetch tasks: ${error.message}`);
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application
 * This runs when the DOM is fully loaded
 */
function init() {
    // Load tasks from localStorage
    loadTasks();

    // Initial render
    render();

    // Set up event listeners
    // Using event delegation for dynamic elements is more efficient

    // Modal controls
    document.getElementById('new-task-btn').addEventListener('click', () => openTaskModal());
    document.getElementById('create-first-task').addEventListener('click', () => openTaskModal());
    document.getElementById('close-modal').addEventListener('click', closeTaskModal);
    document.getElementById('cancel-btn').addEventListener('click', closeTaskModal);
    document.getElementById('task-form').addEventListener('submit', handleTaskFormSubmit);

    // Close modal when clicking outside
    document.getElementById('task-modal').addEventListener('click', (e) => {
        if (e.target.id === 'task-modal') {
            closeTaskModal();
        }
    });

    // Filters (using event delegation)
    document.getElementById('status-filters').addEventListener('click', handleFilterClick);
    document.getElementById('priority-filters').addEventListener('click', handleFilterClick);

    // Search
    document.getElementById('search-input').addEventListener('input', handleSearch);

    // Sort
    document.getElementById('sort-select').addEventListener('change', handleSortChange);

    // Task actions (using event delegation)
    document.getElementById('task-grid').addEventListener('click', handleTaskAction);

    // Clear completed tasks
    document.getElementById('clear-completed').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            clearCompletedTasks();
            render();
        }
    });

    // Retry button for error state
    document.getElementById('retry-btn').addEventListener('click', () => {
        loadTasks();
        render();
    });

    // Keyboard shortcuts (bonus feature!)
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }

        // Escape to close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('task-modal');
            if (modal.style.display === 'flex') {
                closeTaskModal();
            }
        }

        // Ctrl/Cmd + N to create new task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openTaskModal();
        }
    });

    console.log('✅ TaskMaster initialized!');
    console.log('💡 Keyboard shortcuts:');
    console.log('   Ctrl/Cmd + K: Focus search');
    console.log('   Ctrl/Cmd + N: New task');
    console.log('   Escape: Close modal');
}

// Wait for DOM to be fully loaded before initializing
// This ensures all elements exist before we try to manipulate them
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already loaded
    init();
}

// ============================================
// EXPORT FOR POTENTIAL TESTING (Advanced)
// ============================================
// In a real app with a build system, you'd export these for testing
// For now, we'll attach them to window for console debugging

window.TaskMasterDebug = {
    getState: () => AppState,
    getTasks: () => AppState.tasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTasksFromAPI
};

console.log('🔧 Debug tools available via window.TaskMasterDebug');
