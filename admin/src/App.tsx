import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Content from './pages/Content';
import FeatureStrip from './pages/FeatureStrip';
import Settings from './pages/Settings';
import Login from './pages/Login';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/categories': 'Categories',
  '/content': 'Content Management',
  '/content/feature-strip': 'Feature Strip',
  '/settings': 'Settings',
};

function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = titles[location.pathname] || 'Admin';

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 ml-0 md:ml-60 min-w-0">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/content" element={<Content />} />
            <Route
              path="/content/feature-strip"
              element={<FeatureStrip />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}