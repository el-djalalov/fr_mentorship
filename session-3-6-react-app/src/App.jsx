/**
 * SESSIONS 3-6 - REACT APPLICATION
 *
 * This comprehensive React application demonstrates all concepts:
 * - SESSION 3: Components, Props, Composition
 * - SESSION 4: State Management, useReducer, Forms
 * - SESSION 5: Effects, Custom Hooks, Routing, Data Fetching
 * - SESSION 6: Styling, Loading States, Polish
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import NavbarTailwind from './components/layout/NavbarTailwind';
import DashboardTailwind from './pages/DashboardTailwind';
import AllTasks from './pages/AllTasks';
import TaskDetail from './pages/TaskDetail';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <TaskProvider>
        <div className="min-h-screen bg-gray-50">
          <NavbarTailwind />
          <main>
            <Routes>
              <Route path="/" element={<DashboardTailwind />} />
              <Route path="/tasks" element={<AllTasks />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
        </div>
      </TaskProvider>
    </Router>
  );
}

export default App;
