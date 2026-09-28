import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AdminSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}
        aria-label="Admin Navigation"
      >
        <div className="admin-sidebar-top">
          <div className="admin-brand-card">
            <h2 className="admin-brand-heading">M² Cakery</h2>
            <span className="admin-brand-tag">PORTFOLIO CMS</span>
          </div>

          <nav className="admin-nav" aria-label="Main CMS Sections">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'is-active' : ''}`
              }
              onClick={onClose}
            >
              <span className="admin-nav-icon" aria-hidden="true">
                📊
              </span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'is-active' : ''}`
              }
              onClick={onClose}
            >
              <span className="admin-nav-icon" aria-hidden="true">
                🎂
              </span>
              <span>Products & Cakes</span>
            </NavLink>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-divider" aria-hidden="true" />

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item admin-nav-external"
            onClick={onClose}
          >
            <span className="admin-nav-icon" aria-hidden="true">
              🌐
            </span>
            <span>View Live Website</span>
            <span className="admin-arrow">↗</span>
          </Link>

          <button
            type="button"
            className="admin-nav-item admin-logout-item"
            onClick={() => {
              onClose();
              logout();
            }}
          >
            <span className="admin-nav-icon" aria-hidden="true">
              🚪
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
