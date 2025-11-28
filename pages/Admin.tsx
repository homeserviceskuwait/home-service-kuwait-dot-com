import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Package, Plus, Search, MessageSquare, ClipboardList } from 'lucide-react';
import Logo from '../components/Logo';
import { CONTENT } from '../constants';
import { useLanguage } from '../LanguageContext';
import { ServiceRequest } from '../types';

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <Logo className="w-8 h-8" />
        <span className="font-bold text-lg">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-2">
        <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/dashboard') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link to="/admin/services" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/services') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <Package className="w-5 h-5" />
          Services
        </Link>
        <Link to="/admin/requests" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/requests') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <ClipboardList className="w-5 h-5" />
          Requests
        </Link>
        <Link to="/admin/blogs" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/blogs') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <FileText className="w-5 h-5" />
          Blog Posts
        </Link>
        <Link to="/admin/testimonials" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/testimonials') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <MessageSquare className="w-5 h-5" />
          Testimonials
        </Link>
        <div className="pt-4 mt-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5" />
            View Live Site
          </Link>
        </div>
      </nav>

      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-auto">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

const DashboardView: React.FC = () => {
  // Using mock data from constants to simulate stats
  const stats = [
    { label: 'Total Visits', value: '12,450', change: '+12%' },
    { label: 'Service Requests', value: '143', change: '+5%' },
    { label: 'Active Services', value: '28', change: '0%' },
    { label: 'Revenue (KWD)', value: '4,200', change: '+18%' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">New Service Request</p>
                  <p className="text-xs text-slate-500">From Abdullah Al-Sabah • 2 mins ago</p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-600 cursor-pointer">View</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ServicesView: React.FC = () => {
  const { language } = useLanguage();
  const services = CONTENT[language].services.list;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Services</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-teal-700">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search services..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-1 focus:ring-teal-500" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Service Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Price Start</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                  <img src={s.imageUrl} className="w-8 h-8 rounded-lg object-cover" alt="" />
                  {s.title}
                </td>
                <td className="px-6 py-4 text-slate-500">Installation</td>
                <td className="px-6 py-4 text-slate-900">{s.priceStart}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-teal-600 font-bold text-xs hover:underline mr-3">Edit</button>
                  <button className="text-red-500 font-bold text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TestimonialsView: React.FC = () => {
  const { language } = useLanguage();
  const testimonials = CONTENT[language].testimonials.list;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Testimonials</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-teal-700">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Rating</th>
              <th className="px-6 py-4 font-semibold">Comment</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {testimonials.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">{t.name}</td>
                <td className="px-6 py-4 text-slate-500">{t.role}</td>
                <td className="px-6 py-4 text-slate-900">{'★'.repeat(t.rating)}</td>
                <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{t.comment}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-red-500 font-bold text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const BlogPostsView: React.FC = () => {
  const { language } = useLanguage();
  const blogs = CONTENT[language].blog.list;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Blog Posts</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-teal-700">
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Excerpt</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogs.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                  <img src={b.imageUrl} className="w-8 h-8 rounded-lg object-cover" alt="" />
                  {b.title}
                </td>
                <td className="px-6 py-4 text-slate-500">{b.date}</td>
                <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{b.excerpt}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-teal-600 font-bold text-xs hover:underline mr-3">Edit</button>
                  <button className="text-red-500 font-bold text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const RequestsView: React.FC = () => {
  // Mock data for requests
  const requests: ServiceRequest[] = [
    { id: '1', customerName: 'Ahmed Al-Kandari', serviceType: 'CCTV Installation', status: 'pending', date: '2023-11-28', amount: '150 KWD' },
    { id: '2', customerName: 'Sarah Smith', serviceType: 'Smart Lock Setup', status: 'completed', date: '2023-11-27', amount: '45 KWD' },
    { id: '3', customerName: 'Fahad Al-Ajmi', serviceType: 'PBX System', status: 'in-progress', date: '2023-11-26', amount: '300 KWD' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Service</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">{r.customerName}</td>
                <td className="px-6 py-4 text-slate-500">{r.serviceType}</td>
                <td className="px-6 py-4 text-slate-500">{r.date}</td>
                <td className="px-6 py-4 text-slate-900 font-bold">{r.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-teal-600 font-bold text-xs hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Admin: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

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
          <Route path="*" element={<DashboardView />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;