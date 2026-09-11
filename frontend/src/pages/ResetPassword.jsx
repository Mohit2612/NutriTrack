import { useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setMessage('Password successfully reset. You can now login with your new password.');
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-2">Reset Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {!message ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Set New Password</button>
          </form>
        ) : (
          <div className="text-center mt-2">
            <Link to="/login" className="btn btn-primary btn-block">Go to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
