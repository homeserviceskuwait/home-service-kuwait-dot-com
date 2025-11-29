import React, { useEffect, useState } from 'react';
import { Users, FileText, ClipboardList, Package } from 'lucide-react';
import { getDashboardStats, getServiceRequests } from '../../services/apiService';
import { ServiceRequest } from '../../services/supabase';

const DashboardView: React.FC = () => {
    const [stats, setStats] = useState({
        totalServices: 0,
        totalRequests: 0,
        pendingRequests: 0,
        totalBlogs: 0
    });
    const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardStats, requests] = await Promise.all([
                    getDashboardStats(),
                    getServiceRequests()
                ]);
                setStats(dashboardStats);
                setRecentRequests(requests.slice(0, 5)); // Get top 5 recent requests
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Services', value: stats.totalServices, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Requests', value: stats.totalRequests, icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Total Blogs', value: stats.totalBlogs, icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            {stat.label === 'Pending Requests' && stat.value > 0 && (
                                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Action Needed</span>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                        <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Recent Service Requests</h3>
                <div className="space-y-4">
                    {recentRequests.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">No service requests found.</p>
                    ) : (
                        recentRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{request.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {request.service_type} • {new Date(request.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${request.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                        request.status === 'completed' ? 'bg-green-100 text-green-600' :
                                            'bg-slate-100 text-slate-600'
                                    }`}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardView;
