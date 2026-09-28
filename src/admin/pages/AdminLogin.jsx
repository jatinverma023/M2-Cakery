import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(
        err.message || 'Invalid email or password. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="admin-login-brand">
          <span className="admin-login-logo">M² Cakery</span>
          <span className="admin-login-badge">PORTFOLIO CMS</span>
          <h1 className="admin-login-title">Administrator Sign In</h1>
          <p className="admin-login-subtitle">
            Manage celebration cake portfolio, photographs, and confections.
          </p>
        </div>

        {errorMessage && (
          <div className="admin-alert admin-alert-danger" role="alert">
            <span className="admin-alert-icon" aria-hidden="true">
              ⚠
            </span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          <div className="admin-form-group">
            <label htmlFor="admin-email" className="admin-label">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              className="admin-input"
              placeholder="admin@m2cakery.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="admin-form-group">
            <div className="admin-label-row">
              <label htmlFor="admin-password" className="admin-label">
                Password
              </label>
              <button
                type="button"
                className="admin-link-btn admin-toggle-pw"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={0}
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
            </div>

            <div className="admin-pw-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="admin-input admin-pw-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="admin-btn-content">
                <span className="admin-spinner-sm" aria-hidden="true" />
                <span>Signing In...</span>
              </span>
            ) : (
              <span>Sign In to Dashboard →</span>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="admin-back-link">
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
