import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, FileText, MessageSquare, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
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
                <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/settings') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                    <Settings className="w-5 h-5" />
                    Settings
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

export default AdminSidebar;
