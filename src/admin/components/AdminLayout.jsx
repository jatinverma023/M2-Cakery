import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { ToastProvider } from './Toast';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="admin-root">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="admin-main-wrapper">
          <AdminHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <main className="admin-main-content" role="main">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
