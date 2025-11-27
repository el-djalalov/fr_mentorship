/**
 * TASK CONTEXT - Global State Management (SESSION 4)
 *
 * This demonstrates:
 * - Context API for global state
 * - useReducer for complex state logic
 * - Custom context hook pattern
 */

import { createContext, useContext, useReducer, useEffect } from 'react';

// Create context
const TaskContext = createContext();

// Initial state
const initialState = {
  tasks: [],
  filters: {
    status: 'all',
    priority: 'all',
    searchTerm: ''
  },
  sortBy: 'date'
};

// Action types (like constants in backend)
const ACTION_TYPES = {
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_TASK: 'TOGGLE_TASK',
  SET_FILTER: 'SET_FILTER',
  SET_SORT: 'SET_SORT',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED'
};

// Reducer function (like a pure function that returns new state)
function taskReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_TASKS:
      return {
        ...state,
        tasks: action.payload
      };

    case ACTION_TYPES.ADD_TASK:
      // Generate unique ID using timestamp + random component
      const newId = Date.now() + Math.floor(Math.random() * 1000);
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: newId, status: 'pending' }]
      };

    case ACTION_TYPES.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };

    case ACTION_TYPES.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case ACTION_TYPES.TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? {
                ...task,
                status: task.status === 'completed' ? 'pending' : 'completed',
                completedAt: task.status === 'completed' ? null : new Date().toISOString()
              }
            : task
        )
      };

    case ACTION_TYPES.SET_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterType]: action.payload.value
        }
      };

    case ACTION_TYPES.SET_SORT:
      return {
        ...state,
        sortBy: action.payload
      };

    case ACTION_TYPES.CLEAR_COMPLETED:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.status !== 'completed')
      };

    default:
      return state;
  }
}

// Sample data (same as vanilla JS version)
const getSampleTasks = () => [
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

// Provider component
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on mount (SESSION 5 - useEffect)
  useEffect(() => {
    const stored = localStorage.getItem('taskmaster-react-tasks');
    if (stored) {
      dispatch({ type: ACTION_TYPES.SET_TASKS, payload: JSON.parse(stored) });
    } else {
      dispatch({ type: ACTION_TYPES.SET_TASKS, payload: getSampleTasks() });
    }
  }, []);

  // Save tasks to localStorage whenever they change (SESSION 5 - useEffect)
  useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem('taskmaster-react-tasks', JSON.stringify(state.tasks));
    }
  }, [state.tasks]);

  // Helper functions (like service methods in backend)
  const value = {
    // State
    tasks: state.tasks,
    filters: state.filters,
    sortBy: state.sortBy,

    // Actions
    addTask: (task) => dispatch({ type: ACTION_TYPES.ADD_TASK, payload: task }),
    updateTask: (id, updates) => dispatch({ type: ACTION_TYPES.UPDATE_TASK, payload: { id, updates } }),
    deleteTask: (id) => dispatch({ type: ACTION_TYPES.DELETE_TASK, payload: id }),
    toggleTask: (id) => dispatch({ type: ACTION_TYPES.TOGGLE_TASK, payload: id }),
    setFilter: (filterType, value) => dispatch({ type: ACTION_TYPES.SET_FILTER, payload: { filterType, value } }),
    setSort: (sortBy) => dispatch({ type: ACTION_TYPES.SET_SORT, payload: sortBy }),
    clearCompleted: () => dispatch({ type: ACTION_TYPES.CLEAR_COMPLETED }),

    // Computed values (like views/DTOs in backend)
    getFilteredTasks: () => {
      let result = [...state.tasks];

      // Filter by status
      if (state.filters.status !== 'all') {
        result = result.filter(task => task.status === state.filters.status);
      }

      // Filter by priority
      if (state.filters.priority !== 'all') {
        result = result.filter(task => task.priority === state.filters.priority);
      }

      // Filter by search term
      if (state.filters.searchTerm) {
        const search = state.filters.searchTerm.toLowerCase();
        result = result.filter(task =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
        );
      }

      // Sort
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      switch (state.sortBy) {
        case 'priority':
          result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
          break;
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'date':
        default:
          result.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          });
      }

      return result;
    },

    getStats: () => {
      const stats = state.tasks.reduce((acc, task) => {
        acc.total++;
        if (task.status === 'completed') acc.completed++;
        else acc.inProgress++;
        return acc;
      }, { total: 0, inProgress: 0, completed: 0 });

      stats.completionRate = stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;

      return stats;
    }
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook to use the context (SESSION 5 - Custom Hooks)
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}
