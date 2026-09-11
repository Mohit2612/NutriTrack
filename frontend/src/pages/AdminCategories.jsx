import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitError, setSubmitError] = useState(null);

  const fetchCategories = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get('http://localhost:5000/api/admin/categories', config);
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? (It will fail if foods are using it)')) return;
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.delete(`http://localhost:5000/api/admin/categories/${id}`, config);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
    }
  };

  const openAdd = () => {
    setForm({ name: '', description: '' });
    setFormMode('add');
    setEditId(null);
    setSubmitError(null);
  };

  const openEdit = (category) => {
    setForm({ name: category.name, description: category.description || '' });
    setFormMode('edit');
    setEditId(category._id);
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      if (formMode === 'add') {
        const { data } = await axios.post(`http://localhost:5000/api/admin/categories`, form, config);
        setCategories([data, ...categories]);
      } else {
        const { data } = await axios.put(`http://localhost:5000/api/admin/categories/${editId}`, form, config);
        setCategories(categories.map(c => (c._id === editId ? data : c)));
      }
      
      setFormMode(null);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error saving category');
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-page card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Category Management</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
      </div>

      <div className="table-responsive" style={{ marginTop: '20px' }}>
        <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td>{cat.name}</td>
                <td>{cat.description || '-'}</td>
                <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(cat)}>Edit</button>
                  <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(cat._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formMode && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3>{formMode === 'add' ? 'Add New Category' : 'Edit Category'}</h3>
          {submitError && <div className="error-message">{submitError}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', maxWidth: '400px' }}>
              <div>
                <label>Name:</label>
                <input type="text" className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <label>Description:</label>
                <textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">{formMode === 'add' ? 'Add Category' : 'Save Changes'}</button>
              <button type="button" className="btn btn-secondary ml-2" onClick={() => setFormMode(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
