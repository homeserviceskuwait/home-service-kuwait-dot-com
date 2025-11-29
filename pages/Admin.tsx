import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardView from '../components/admin/DashboardView';
import ServicesView from '../components/admin/ServicesView';
import RequestsView from '../components/admin/RequestsView';
import BlogPostsView from '../components/admin/BlogPostsView';
import TestimonialsView from '../components/admin/TestimonialsView';
import SettingsView from '../components/admin/SettingsView';

const Admin: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { setLanguage } = useLanguage();

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
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="services" element={<ServicesView />} />
          <Route path="requests" element={<RequestsView />} />
          <Route path="blogs" element={<BlogPostsView />} />
          <Route path="testimonials" element={<TestimonialsView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="*" element={<DashboardView />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;