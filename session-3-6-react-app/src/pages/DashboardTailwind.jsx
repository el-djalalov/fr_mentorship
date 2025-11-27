/**
 * DASHBOARD WITH TAILWIND CSS (SESSIONS 3-6 COMPLETE)
 *
 * This demonstrates ALL concepts from the curriculum:
 * - SESSION 3: Components, Props, Composition, Lists
 * - SESSION 4: useState, Event Handling, Conditional Rendering
 * - SESSION 5: useEffect, Context API (via useTasks hook)
 * - SESSION 6: Tailwind CSS, Loading States, Animations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import Button from '../components/ui/Button';
import TaskModal from '../components/features/TaskModal';

export default function DashboardTailwind() {
  // SESSION 5: Custom hook for global state
  const { getStats, getFilteredTasks, toggleTask, deleteTask } = useTasks();
  const navigate = useNavigate();

  // SESSION 4: Local state for UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const stats = getStats();
  const recentTasks = getFilteredTasks().slice(0, 6);

  // SESSION 4: Event handlers
  const handleNewTask = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    setDeleteConfirm(null);
  };

  const handleToggleTask = (taskId) => {
    toggleTask(taskId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">
                Welcome back! Here's an overview of your tasks.
              </p>
            </div>
            <Button onClick={handleNewTask} size="lg">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SESSION 6: Stats Cards with Tailwind */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📊"
            title="Total Tasks"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon="🎯"
            title="In Progress"
            value={stats.inProgress}
            color="yellow"
          />
          <StatCard
            icon="✨"
            title="Completed"
            value={stats.completed}
            color="green"
          />
          <StatCard
            icon="🔥"
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            color="purple"
          />
        </div>

        {/* Recent Tasks Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          {/* SESSION 3: Conditional rendering */}
          {recentTasks.length === 0 ? (
            // SESSION 6: Empty state with Tailwind
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tasks yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first task to get started!
              </p>
              <Button onClick={handleNewTask}>
                Create Task
              </Button>
            </div>
          ) : (
            // SESSION 3: List rendering
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => setDeleteConfirm(task.id)}
                  onToggle={() => handleToggleTask(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SESSION 4: Modal Component */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      {/* SESSION 6: Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Task?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteTask(deleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SESSION 3: Reusable Stat Card Component
function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`text-4xl p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// SESSION 3 & 6: Enhanced Task Card with Tailwind
function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const priorityStyles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  return (
    <div className={`bg-white border rounded-xl p-4 hover:shadow-lg transition-all ${
      task.status === 'completed' ? 'opacity-60' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityStyles[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <div className="relative group">
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold mb-2 ${
        task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
      }`}>
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between text-sm mb-4 pt-4 border-t">
        <span className="text-gray-500">
          📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {task.status === 'completed' ? '✓ Done' : 'Pending'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {task.status === 'pending' ? (
          <>
            <Button size="sm" variant="success" onClick={onToggle} className="flex-1">
              Complete
            </Button>
            <Button size="sm" variant="secondary" onClick={onEdit} className="flex-1">
              Edit
            </Button>
          </>
        ) : (
          <Button size="sm" variant="secondary" onClick={onToggle} className="flex-1">
            Reopen
          </Button>
        )}
        <Button size="sm" variant="danger" onClick={onDelete}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
