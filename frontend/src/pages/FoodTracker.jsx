import { useState, useEffect } from 'react';
import api from '../services/api';
import FoodForm from '../components/FoodForm';
import FoodList from '../components/FoodList';

const FoodTracker = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayFoods = async () => {
    try {
      setLoading(true);
      const res = await api.get('/foods/today');
      setFoods(res.data);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayFoods();
  }, []);

  const handleAddFood = async (foodData) => {
    try {
      await api.post('/foods', foodData);
      // Re-fetch to get updated list
      fetchTodayFoods();
    } catch (error) {
      console.error('Failed to add food:', error);
      alert('Failed to add food');
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      await api.delete(`/foods/${id}`);
      fetchTodayFoods();
    } catch (error) {
      console.error('Failed to delete food:', error);
      alert('Failed to delete food');
    }
  };

  return (
    <div>
      <h1>Food Tracker</h1>
      <p className="mb-3 text-light">Track everything you eat today.</p>
      
      <FoodForm onAddFood={handleAddFood} />
      
      <div className="mt-2">
        {loading ? <p>Loading...</p> : <FoodList foods={foods} onDeleteFood={handleDeleteFood} />}
      </div>
    </div>
  );
};

export default FoodTracker;
