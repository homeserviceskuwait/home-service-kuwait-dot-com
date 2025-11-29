import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ServiceDetail from './pages/ServiceDetail';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SiteSettingsProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Login />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              {/* Catch all redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SiteSettingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;