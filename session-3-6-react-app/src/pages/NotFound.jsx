import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ marginBottom: '2rem', color: '#64748b' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
