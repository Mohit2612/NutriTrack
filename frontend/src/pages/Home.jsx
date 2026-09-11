import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section text-center">
        <h1>Track your nutrition. Build healthier habits.</h1>
        <p className="hero-subtitle">
          NutriTrack is your all-in-one assistant for monitoring meals, tracking your health progress, and achieving your fitness goals.
        </p>
        <div className="cta-container mt-2">
          <Link to="/register" className="btn btn-primary btn-lg" style={{ marginRight: '15px' }}>Get Started</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
        </div>
      </section>

      <section className="features-section container">
        <h2 className="text-center mb-3">Everything you need to succeed</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <h3>🍎 Nutrition Tracking</h3>
            <p>Monitor your daily calories, protein, carbs, fats, and fiber seamlessly.</p>
          </div>
          <div className="feature-card card">
            <h3>🍽️ Meal Tracking</h3>
            <p>Easily log breakfast, lunch, dinner, and snacks using our extensive food database.</p>
          </div>
          <div className="feature-card card">
            <h3>💧 Water Tracking</h3>
            <p>Stay hydrated by recording your daily water intake effortlessly.</p>
          </div>
          <div className="feature-card card">
            <h3>⚖️ Weight & BMI</h3>
            <p>Log your weight to calculate your BMI and monitor your physical changes.</p>
          </div>
          <div className="feature-card card">
            <h3>📈 Progress Charts</h3>
            <p>Visualize your nutrition and weight journey with our easy-to-read charts.</p>
          </div>
          <div className="feature-card card">
            <h3>💡 Food Suggestions</h3>
            <p>Receive smart dietary recommendations based on your unique fitness goals.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
