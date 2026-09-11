import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="container text-center">
        <h3>NutriTrack</h3>
        <p>Your personal Diet & Nutrition Tracker</p>
        <div style={{ marginTop: '10px' }}>
          <Link to="/" style={{ color: '#fff', marginRight: '15px' }}>Home</Link>
          <Link to="/login" style={{ color: '#fff', marginRight: '15px' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </div>
        <div style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} NutriTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
