/**
 * DASHBOARD PAGE (SESSIONS 3-6)
 *
 * Demonstrates:
 * - Using context with custom hook
 * - Rendering lists with map
 * - Component composition
 * - Conditional rendering
 */

import { useTasks } from '../context/TaskContext';
import './Dashboard.css';

function Dashboard() {
  const { getStats, getFilteredTasks } = useTasks();
  const stats = getStats();
  const recentTasks = getFilteredTasks().slice(0, 6);

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Welcome back! Here's an overview of your tasks.</p>
      </header>

      {/* Stats Cards (SESSION 3 - Component Composition) */}
      <section className="stats-grid">
        <StatCard icon="📊" title="Total Tasks" value={stats.total} />
        <StatCard icon="🎯" title="In Progress" value={stats.inProgress} />
        <StatCard icon="✨" title="Completed" value={stats.completed} />
        <StatCard icon="🔥" title="Completion Rate" value={`${stats.completionRate}%`} />
      </section>

      {/* Recent Tasks (SESSION 3 - List Rendering) */}
      <section className="recent-tasks">
        <h2>Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create your first task to get started!</p>
          </div>
        ) : (
          <div className="task-list">
            {recentTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Reusable StatCard Component (SESSION 3)
function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-number">{value}</p>
      </div>
    </div>
  );
}

// Task Card Component (SESSION 3)
function TaskCard({ task }) {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return (
    <div className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-header">
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColors[task.priority] + '20', color: priorityColors[task.priority] }}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
        </span>
      </div>
      <h3>{task.title}</h3>
      <p className="task-description">{task.description}</p>
      <div className="task-meta">
        <span>📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
        <span className={`status-badge ${task.status}`}>
          {task.status === 'completed' ? '✓ Completed' : 'Pending'}
        </span>
      </div>
    </div>
  );
}

export default Dashboard;
