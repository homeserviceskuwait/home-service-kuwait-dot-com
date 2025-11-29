import React from 'react';
import { Users } from 'lucide-react';

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

export default DashboardView;
