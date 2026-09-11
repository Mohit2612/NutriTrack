import { NavLink } from 'react-router-dom';

// Sidebar receives userRole to conditionally show admin navigation
const Sidebar = ({ userRole }) => {
  return (
    <div className="sidebar">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        Dashboard
      </NavLink>
      <NavLink 
        to="/food-search" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        Food Search
      </NavLink>
      <NavLink 
        to="/meals" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        Meals
      </NavLink>
      <NavLink 
        to="/history" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        Meal History
      </NavLink>
      <NavLink 
        to="/water" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        Water
      </NavLink>
      <NavLink 
        to="/weight" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        Weight
      </NavLink>
      <NavLink 
        to="/progress" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        Progress
      </NavLink>
      <NavLink 
        to="/food-suggestions" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        💡 Suggestions
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
      >
        Profile
      </NavLink>

      {/* Admin-only navigation — only shown when logged-in user is admin */}
      {userRole === 'admin' && (
        <>
          <div style={{ borderTop: '1px solid var(--border)', margin: '10px 0' }} />
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            style={{ color: '#9c27b0' }}
          >
            🛡️ Admin Dashboard
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            style={{ color: '#9c27b0' }}
          >
            👥 Users
          </NavLink>
          <NavLink 
            to="/admin/foods" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            style={{ color: '#9c27b0' }}
          >
            🍎 Foods
          </NavLink>
          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            style={{ color: '#9c27b0' }}
          >
            🏷️ Categories
          </NavLink>
          <NavLink 
            to="/admin/reports" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            style={{ color: '#9c27b0' }}
          >
            📊 Reports
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;

