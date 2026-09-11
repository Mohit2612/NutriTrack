import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          NutriTrack
        </Link>
      </div>
      <div className="navbar-user">
        <Link to="/food-search" style={{ marginRight: '15px', color: 'var(--primary)', textDecoration: 'none' }}>Food DB</Link>
        <span style={{ marginRight: '15px' }}>Hello, {user.name}</span>
        <button onClick={onLogout} className="btn btn-danger btn-sm">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
