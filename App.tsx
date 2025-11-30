import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ServiceDetail from './pages/ServiceDetail';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { CartProvider } from './contexts/CartContext';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <SiteSettingsProvider>
              <CartProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin" element={<Login />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  {/* Catch all redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </CartProvider>
            </SiteSettingsProvider>
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </HelmetProvider>
  );
};

export default App;