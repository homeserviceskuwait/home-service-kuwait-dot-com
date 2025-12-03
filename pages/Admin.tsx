import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { Menu } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardView from '../components/admin/DashboardView';
import ServicesView from '../components/admin/ServicesView';
import ProductsView from '../components/admin/ProductsView';
import OrdersView from '../components/admin/OrdersView';
import RequestsView from '../components/admin/RequestsView';
import BlogPostsView from '../components/admin/BlogPostsView';
import TestimonialsView from '../components/admin/TestimonialsView';
import SettingsView from '../components/admin/SettingsView';
import PerformanceView from '../components/admin/PerformanceView';
import SEOView from '../components/admin/SEOView';
import Logo from '../components/Logo';

const Admin: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { setLanguage } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-lg text-slate-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="services" element={<ServicesView />} />
            <Route path="products" element={<ProductsView />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="requests" element={<RequestsView />} />
            <Route path="blogs" element={<BlogPostsView />} />
            <Route path="testimonials" element={<TestimonialsView />} />
            <Route path="performance" element={<PerformanceView />} />
            <Route path="seo" element={<SEOView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="*" element={<DashboardView />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;