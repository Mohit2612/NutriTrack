import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const fetchUsers = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      activityLevel: user.activityLevel,
      fitnessGoal: user.fitnessGoal,
      dietaryPreference: user.dietaryPreference
    });
    setSubmitError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.put(`http://localhost:5000/api/admin/users/${editingUser}`, editForm, config);
      
      setUsers(users.map(u => (u._id === editingUser ? data : u)));
      setEditingUser(null);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error updating user');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-page card">
      <h2>User Management</h2>
      <div className="table-responsive">
        <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Fitness Goal</th>
              <th>Diet</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>{user.role}</span></td>
                <td>{user.fitnessGoal}</td>
                <td>{user.dietaryPreference}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEditClick(user)}>Edit</button>
                  <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3>Edit User</h3>
          {submitError && <div className="error-message">{submitError}</div>}
          <form onSubmit={handleEditSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Name:</label>
                <input type="text" className="form-control" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" className="form-control" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} required />
              </div>
              <div>
                <label>Role:</label>
                <select className="form-control" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label>Age:</label>
                <input type="number" className="form-control" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} required />
              </div>
              <div>
                <label>Gender:</label>
                <select className="form-control" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label>Height (cm):</label>
                <input type="number" className="form-control" value={editForm.height} onChange={e => setEditForm({...editForm, height: e.target.value})} required />
              </div>
              <div>
                <label>Weight (kg):</label>
                <input type="number" className="form-control" value={editForm.weight} onChange={e => setEditForm({...editForm, weight: e.target.value})} required />
              </div>
              <div>
                <label>Activity Level:</label>
                <select className="form-control" value={editForm.activityLevel} onChange={e => setEditForm({...editForm, activityLevel: e.target.value})}>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Lightly Active">Lightly Active</option>
                  <option value="Moderately Active">Moderately Active</option>
                  <option value="Very Active">Very Active</option>
                  <option value="Super Active">Super Active</option>
                </select>
              </div>
              <div>
                <label>Fitness Goal:</label>
                <select className="form-control" value={editForm.fitnessGoal} onChange={e => setEditForm({...editForm, fitnessGoal: e.target.value})}>
                  <option value="Lose Weight">Lose Weight</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                  <option value="Build Muscle">Build Muscle</option>
                </select>
              </div>
              <div>
                <label>Dietary Preference:</label>
                <select className="form-control" value={editForm.dietaryPreference} onChange={e => setEditForm({...editForm, dietaryPreference: e.target.value})}>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="Paleo">Paleo</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
