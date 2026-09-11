import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Since backend logic for this isn't mandated to be created, we supply visual feedback.
    setError(null);
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setMessage('If that email exists in our system, you will receive a password reset link shortly.');
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-2">Forgot Password</h2>
        <p className="text-center mb-3" style={{ color: 'var(--text-light)' }}>
          Enter your email address and we will send you a link to reset your password.
        </p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Send Reset Link</button>
        </form>

        <div className="text-center mt-2">
          <Link to="/login" style={{ color: 'var(--primary-color)' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
