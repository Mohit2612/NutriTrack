import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaLightbulb, FaPlus, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FoodSuggestions = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Meal Adding State
    const [selectedFood, setSelectedFood] = useState(null);
    const [mealType, setMealType] = useState('Snacks');
    const [servings, setServings] = useState(1);
    const [adding, setAdding] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await api.get('/food-suggestions');
                setData(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load personalized food suggestions.');
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    const handleAddToMeal = async (e) => {
        e.preventDefault();
        if (!selectedFood) return;

        try {
            setAdding(true);
            await api.post('/meals', {
                foodItemId: selectedFood._id,
                mealType,
                servings
            });
            setSuccessMsg(`Added ${servings} serving(s) of ${selectedFood.name} to ${mealType}!`);
            setSelectedFood(null);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to add meal.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="text-center p-5 text-light">Loading personalized suggestions...</div>;
    if (error) return <div className="card p-4 text-center text-danger bg-dark"><FaExclamationCircle /> {error}</div>;

    if (!data || data.recommendations.length === 0) {
        return (
            <div className="card text-center p-5 bg-dark">
                <FaExclamationCircle size={40} color="var(--accent)" className="mb-3" />
                <h3>No Suggestions Available</h3>
                <p className="text-light mt-2">
                    Complete your profile and nutrition goals to get personalized suggestions.
                </p>
                <div className="mt-4">
                    <Link to="/profile" className="btn mx-2">Edit Profile</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="mb-4">
                <h1><FaLightbulb style={{ color: '#ffeb3b' }} /> Personalized Food Suggestions</h1>
                <p className="text-light mt-2">
                    Recommendations based on your <strong>{data.goal}</strong> goal, <strong>{data.dietaryPreference}</strong> preference, and today's nutrition.
                </p>
            </div>

            {successMsg && (
                <div className="card bg-dark text-center mb-4" style={{ borderLeft: '4px solid var(--success)' }}>
                    <FaCheckCircle color="var(--success)" /> {successMsg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {data.recommendations.map((food, index) => (
                    <div key={food._id} className="card bg-dark" style={{ borderTop: `4px solid ${index === 0 ? '#ffeb3b' : 'var(--accent)'}` }}>
                        <div className="flex-between mb-2">
                            <h3 style={{ margin: 0 }}>{food.name}</h3>
                            <span className="badge" style={{ backgroundColor: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {food.category}
                            </span>
                        </div>
                        
                        <div className="mb-3" style={{ fontSize: '0.9rem', color: '#ccc', fontStyle: 'italic', minHeight: '40px' }}>
                            "{food.reason}"
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', marginBottom: '15px' }}>
                            <div><strong>Calories:</strong> {food.calories}</div>
                            <div><strong>Protein:</strong> {food.protein}g</div>
                            <div><strong>Carbs:</strong> {food.carbohydrates}g</div>
                            <div><strong>Fats:</strong> {food.fats}g</div>
                            <div><strong>Fiber:</strong> {food.fiber}g</div>
                            <div><small>per {food.servingSize} {food.servingUnit}</small></div>
                        </div>

                        {selectedFood?._id === food._id ? (
                            <form onSubmit={handleAddToMeal} className="mt-3 p-3" style={{ backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
                                <div className="form-group mb-2">
                                    <label>Meal Type</label>
                                    <select className="form-control" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                        <option value="Breakfast">Breakfast</option>
                                        <option value="Lunch">Lunch</option>
                                        <option value="Dinner">Dinner</option>
                                        <option value="Snacks">Snacks</option>
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Servings</label>
                                    <input type="number" className="form-control" min="0.1" step="0.1" value={servings} onChange={(e) => setServings(e.target.value)} />
                                </div>
                                <div className="flex-between">
                                    <button type="button" className="btn btn-sm" style={{ backgroundColor: '#555' }} onClick={() => setSelectedFood(null)}>Cancel</button>
                                    <button type="submit" className="btn btn-sm btn-primary" disabled={adding}>
                                        {adding ? 'Adding...' : 'Confirm'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button 
                                className="btn btn-block mt-auto" 
                                style={{ backgroundColor: 'var(--accent)' }}
                                onClick={() => setSelectedFood(food)}
                            >
                                <FaPlus /> Add to Meal
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodSuggestions;
