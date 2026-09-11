import { Link } from 'react-router-dom';

const PublicHeader = () => {
  return (
    <header className="public-header">
      <div className="container flex-between">
        <Link to="/" className="navbar-brand">
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            🌱 NutriTrack
          </span>
        </Link>
        <nav className="public-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="btn btn-secondary" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;
