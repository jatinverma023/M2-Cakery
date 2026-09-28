import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import NewProduct from './pages/NewProduct';
import EditProduct from './pages/EditProduct';

import './styles/admin.css';

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Admin Login Route */}
        <Route path="login" element={<AdminLogin />} />

        {/* Protected Admin CMS Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<NewProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
          </Route>
        </Route>

        {/* Fallback to Admin Dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
