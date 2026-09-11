import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    dailyCalorieGoal: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/register', formData);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ margin: '2rem 0' }}>
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-3">Create an Account</h2>
        
        {error && <div className="text-danger mb-2 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength="6" />
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" name="height" className="form-control" value={formData.height} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" name="weight" className="form-control" value={formData.weight} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Daily Calorie Goal</label>
              <input type="number" name="dailyCalorieGoal" className="form-control" value={formData.dailyCalorieGoal} onChange={handleChange} required min="500" />
            </div>
          </div>

          <button type="submit" className="btn btn-block" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="text-center mt-2">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
