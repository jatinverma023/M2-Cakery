import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AdminHeader({ onToggleSidebar }) {
  const { admin, logout } = useAuth();

  return (
    <header className="admin-header" role="banner">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
        >
          <span className="admin-hamburger-line" />
          <span className="admin-hamburger-line" />
          <span className="admin-hamburger-line" />
        </button>

        <div className="admin-header-brand-mobile">
          <span className="admin-logo-text">M² Cakery</span>
          <span className="admin-badge">Admin</span>
        </div>
      </div>

      <div className="admin-header-right">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-header-link"
          title="Open live customer website in new tab"
        >
          <span>View Website</span>
          <span className="admin-link-arrow">↗</span>
        </Link>

        <div className="admin-user-pill">
          <span className="admin-user-avatar" aria-hidden="true">
            {admin?.email ? admin.email.charAt(0).toUpperCase() : 'A'}
          </span>
          <span className="admin-user-email" title={admin?.email}>
            {admin?.email || 'Admin'}
          </span>
        </div>

        <button
          type="button"
          onClick={logout}
          className="admin-logout-btn"
          aria-label="Sign out of admin session"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
