/**
 * NAVBAR COMPONENT (SESSION 3 - Components & Props)
 *
 * Demonstrates:
 * - Functional component
 * - React Router Link component
 * - Conditional CSS classes
 * - Event handling
 */

import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  // Helper function to determine if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="logo">TaskMaster</div>

      <ul className="nav-links">
        <li>
          <Link
            to="/"
            className={isActive('/') ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/tasks"
            className={isActive('/tasks') ? 'active' : ''}
          >
            All Tasks
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className={isActive('/settings') ? 'active' : ''}
          >
            Settings
          </Link>
        </li>
      </ul>

      <Link to="/tasks/new" className="btn btn-primary">
        New Task
      </Link>
    </nav>
  );
}

export default Navbar;
