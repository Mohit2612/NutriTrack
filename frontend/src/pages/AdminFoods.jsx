import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formMode, setFormMode] = useState(null); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '', category: '', calories: 0, protein: 0, carbohydrates: 0, fats: 0, fiber: 0, servingSize: 100, servingUnit: 'g'
  });
  const [submitError, setSubmitError] = useState(null);

  const fetchData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data: foodData } = await axios.get('http://localhost:5000/api/admin/foods', config);
      const { data: catData } = await axios.get('http://localhost:5000/api/admin/categories', config);
      setFoods(foodData);
      setCategories(catData);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching foods or categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.delete(`http://localhost:5000/api/admin/foods/${id}`, config);
      setFoods(foods.filter(f => f._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting food item');
    }
  };

  const openAdd = () => {
    setForm({
      name: '', category: categories.length > 0 ? categories[0].name : '', 
      calories: 0, protein: 0, carbohydrates: 0, fats: 0, fiber: 0, servingSize: 100, servingUnit: 'g'
    });
    setFormMode('add');
    setEditId(null);
    setSubmitError(null);
  };

  const openEdit = (food) => {
    setForm({
      name: food.name, category: food.category, calories: food.calories, protein: food.protein, 
      carbohydrates: food.carbohydrates, fats: food.fats, fiber: food.fiber, 
      servingSize: food.servingSize, servingUnit: food.servingUnit
    });
    setFormMode('edit');
    setEditId(food._id);
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      if (formMode === 'add') {
        const { data } = await axios.post(`http://localhost:5000/api/admin/foods`, form, config);
        setFoods([data, ...foods]);
      } else {
        const { data } = await axios.put(`http://localhost:5000/api/admin/foods/${editId}`, form, config);
        setFoods(foods.map(f => (f._id === editId ? data : f)));
      }
      
      setFormMode(null);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error saving food');
    }
  };

  if (loading) return <div>Loading foods...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-page card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Food Management</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Food</button>
      </div>

      <div className="table-responsive" style={{ marginTop: '20px' }}>
        <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Category</th>
              <th>Calories</th>
              <th>Macros (P/C/F)</th>
              <th>Serving</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(food => (
              <tr key={food._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td>{food.name}</td>
                <td>{food.category}</td>
                <td>{food.calories} kcal</td>
                <td>{food.protein}g / {food.carbohydrates}g / {food.fats}g</td>
                <td>{food.servingSize}{food.servingUnit}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(food)}>Edit</button>
                  <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(food._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {foods.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No food items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formMode && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3>{formMode === 'add' ? 'Add New Food' : 'Edit Food'}</h3>
          {submitError && <div className="error-message">{submitError}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label>Name:</label>
                <input type="text" className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <label>Category:</label>
                {categories.length > 0 ? (
                  <select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                    <option value="" disabled>Select a category</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                ) : (
                  <input type="text" className="form-control" placeholder="Create a category first or enter string" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
                )}
              </div>
              <div>
                <label>Calories:</label>
                <input type="number" className="form-control" value={form.calories} onChange={e => setForm({...form, calories: Number(e.target.value)})} required min="0" />
              </div>
              <div>
                <label>Protein (g):</label>
                <input type="number" className="form-control" value={form.protein} onChange={e => setForm({...form, protein: Number(e.target.value)})} required min="0" />
              </div>
              <div>
                <label>Carbohydrates (g):</label>
                <input type="number" className="form-control" value={form.carbohydrates} onChange={e => setForm({...form, carbohydrates: Number(e.target.value)})} required min="0" />
              </div>
              <div>
                <label>Fats (g):</label>
                <input type="number" className="form-control" value={form.fats} onChange={e => setForm({...form, fats: Number(e.target.value)})} required min="0" />
              </div>
              <div>
                <label>Fiber (g):</label>
                <input type="number" className="form-control" value={form.fiber} onChange={e => setForm({...form, fiber: Number(e.target.value)})} required min="0" />
              </div>
              <div>
                <label>Serving Size:</label>
                <input type="number" className="form-control" value={form.servingSize} onChange={e => setForm({...form, servingSize: Number(e.target.value)})} required min="0" />
              </div>
              <div>
                <label>Serving Unit (e.g. g, ml, cup):</label>
                <input type="text" className="form-control" value={form.servingUnit} onChange={e => setForm({...form, servingUnit: e.target.value})} required />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">{formMode === 'add' ? 'Add Food' : 'Save Changes'}</button>
              <button type="button" className="btn btn-secondary ml-2" onClick={() => setFormMode(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminFoods;
