import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a28CFE', '#E88CFF'];

const AdminReports = () => {
  const [range, setRange] = useState('30d');
  
  const [usersReport, setUsersReport] = useState(null);
  const [foodsReport, setFoodsReport] = useState(null);
  const [mealsReport, setMealsReport] = useState(null);
  const [waterReport, setWaterReport] = useState(null);
  const [weightReport, setWeightReport] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const baseUrl = 'http://localhost:5000/api/admin/reports';
      
      const [uRes, fRes, mRes, waRes, weRes] = await Promise.all([
        axios.get(`${baseUrl}/users?range=${range}`, config),
        axios.get(`${baseUrl}/foods?range=${range}`, config),
        axios.get(`${baseUrl}/meals?range=${range}`, config),
        axios.get(`${baseUrl}/water?range=${range}`, config),
        axios.get(`${baseUrl}/weight?range=${range}`, config)
      ]);

      setUsersReport(uRes.data);
      setFoodsReport(fRes.data);
      setMealsReport(mRes.data);
      setWaterReport(waRes.data);
      setWeightReport(weRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching reports');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [range]);

  if (loading) return <div className="text-center p-5 text-light">Loading reports...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-page card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>System Reports</h2>
        <select 
          className="form-control" 
          style={{ width: '150px' }} 
          value={range} 
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="3m">Last 3 Months</option>
        </select>
      </div>

      {/* USER REPORT */}
      {usersReport && (
        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3>User Report</h3>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div className="stat-box"><strong>Total Users:</strong> {usersReport.totalUsers}</div>
            <div className="stat-box"><strong>Total Admins:</strong> {usersReport.totalAdmins}</div>
            <div className="stat-box"><strong>New Users in Range:</strong> {usersReport.newUsersInRange}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '300px', height: '300px' }}>
              <h4 style={{ textAlign: 'center' }}>Fitness Goals</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={usersReport.usersByFitnessGoal} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {usersReport.usersByFitnessGoal.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, minWidth: '300px', height: '300px' }}>
              <h4 style={{ textAlign: 'center' }}>Dietary Preferences</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={usersReport.usersByDietaryPreference} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {usersReport.usersByDietaryPreference.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* FOOD REPORT */}
      {foodsReport && (
        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3>Food Report</h3>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div className="stat-box"><strong>Total Foods:</strong> {foodsReport.totalFoods}</div>
            <div className="stat-box"><strong>Avg Calories:</strong> {foodsReport.averageCalories} kcal</div>
            <div className="stat-box"><strong>Avg Macros:</strong> P:{foodsReport.averageProtein}g C:{foodsReport.averageCarbs}g F:{foodsReport.averageFats}g</div>
          </div>
          <div style={{ height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>Foods by Category</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={foodsReport.foodsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {foodsReport.foodsByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MEAL REPORT */}
      {mealsReport && (
        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3>Meal Report</h3>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div className="stat-box"><strong>Total Meals:</strong> {mealsReport.totalMeals}</div>
            <div className="stat-box"><strong>Avg Meal Cals:</strong> {mealsReport.averageCaloriesPerMeal} kcal</div>
            <div className="stat-box"><strong>Avg Meal Macros:</strong> P:{mealsReport.averageProteinPerMeal}g C:{mealsReport.averageCarbsPerMeal}g F:{mealsReport.averageFatsPerMeal}g</div>
          </div>
          <div style={{ height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>Meals by Type</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealsReport.mealsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d">
                  {mealsReport.mealsByType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* WATER REPORT */}
      {waterReport && (
        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3>Water Report</h3>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div className="stat-box"><strong>Total Water Logs:</strong> {waterReport.totalWaterLogs}</div>
            <div className="stat-box"><strong>Total Volume Logged:</strong> {waterReport.totalWaterMl} ml</div>
            <div className="stat-box"><strong>Avg Daily Water:</strong> {waterReport.averageDailyWaterMl} ml</div>
          </div>
          <div style={{ height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>Water Logs by Date</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterReport.waterLogsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Amount (ml)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* WEIGHT REPORT */}
      {weightReport && (
        <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3>Weight Report</h3>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div className="stat-box"><strong>Total Weight Logs:</strong> {weightReport.totalWeightLogs}</div>
            <div className="stat-box"><strong>Avg Weight Recorded:</strong> {weightReport.averageRecordedWeight} kg</div>
          </div>
          <div style={{ height: '300px' }}>
            <h4 style={{ textAlign: 'center' }}>Avg Weight by Date</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightReport.weightLogsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line type="monotone" dataKey="averageWeight" stroke="#ff7300" name="Avg Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
