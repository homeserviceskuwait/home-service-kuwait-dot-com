import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, FileText, MessageSquare, Settings, LogOut, X, ShoppingBag, ShoppingCart, Globe, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/admin');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50
                w-64 bg-slate-900 text-white h-full flex flex-col overflow-y-auto p-6
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <Logo className="w-8 h-8" />
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link
                        to="/admin/dashboard"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/dashboard') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/services"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/services') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Package className="w-5 h-5" />
                        Services
                    </Link>
                    <Link
                        to="/admin/products"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/products') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/orders') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Orders
                    </Link>
                    <Link
                        to="/admin/requests"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/requests') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <ClipboardList className="w-5 h-5" />
                        Requests
                    </Link>
                    <Link
                        to="/admin/blogs"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/blogs') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <FileText className="w-5 h-5" />
                        Blog Posts
                    </Link>
                    <Link
                        to="/admin/testimonials"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/testimonials') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        Testimonials
                    </Link>
                    <Link
                        to="/admin/performance"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/performance') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Activity className="w-5 h-5" />
                        Performance
                    </Link>
                    <Link
                        to="/admin/seo"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/seo') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Globe className="w-5 h-5" />
                        SEO
                    </Link>
                    <Link
                        to="/admin/settings"
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/settings') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
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
        </>
    );
};

export default AdminSidebar;
