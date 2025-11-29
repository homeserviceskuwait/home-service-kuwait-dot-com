import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ServiceRequest } from '../../services/supabase';
import { getServiceRequests, updateServiceRequest, deleteServiceRequest } from '../../services/apiService';

const RequestDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    request?: ServiceRequest | null;
}> = ({ isOpen, onClose, request }) => {
    if (!isOpen || !request) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">Request Details</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                        <p className="text-slate-900 font-medium">{request.customer_name}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                        <p className="text-slate-900 font-medium">{request.customer_phone}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Type</label>
                        <p className="text-slate-900 font-medium">{request.service_type}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                        <p className="text-slate-900 font-medium">{new Date(request.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${request.status === 'completed' ? 'bg-green-100 text-green-700' :
                            request.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                request.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                            }`}>
                            {request.status.toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed">
                            {request.message || 'No message provided.'}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const RequestsView: React.FC = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getServiceRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in-progress': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
            </div>

            <RequestDetailsModal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                request={selectedRequest}
            />

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
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
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                requests.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{r.customer_name}</td>
                                        <td className="px-6 py-4 text-slate-500">{r.service_type}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-slate-900 font-bold">{r.amount || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={r.status}
                                                onChange={async (e) => {
                                                    try {
                                                        await updateServiceRequest(r.id, { status: e.target.value as any });
                                                        fetchRequests();
                                                    } catch (error) {
                                                        console.error('Error updating request:', error);
                                                        alert('Error updating request');
                                                    }
                                                }}
                                                className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(r.status)} border-none focus:ring-0 cursor-pointer`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedRequest(r)}
                                                className="text-teal-600 font-bold text-xs hover:underline mr-3"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Are you sure you want to delete this request?')) {
                                                        try {
                                                            await deleteServiceRequest(r.id);
                                                            fetchRequests();
                                                        } catch (error) {
                                                            console.error('Error deleting request:', error);
                                                            alert('Error deleting request');
                                                        }
                                                    }
                                                }}
                                                className="text-red-500 font-bold text-xs hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-100">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="p-4 animate-pulse space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                            </div>
                        ))
                    ) : (
                        requests.map(r => (
                            <div key={r.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{r.customer_name}</h3>
                                        <p className="text-sm text-slate-500">{r.service_type}</p>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">{r.amount || 'N/A'}</span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                                    <select
                                        value={r.status}
                                        onChange={async (e) => {
                                            try {
                                                await updateServiceRequest(r.id, { status: e.target.value as any });
                                                fetchRequests();
                                            } catch (error) {
                                                console.error('Error updating request:', error);
                                                alert('Error updating request');
                                            }
                                        }}
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(r.status)} border-none focus:ring-0 cursor-pointer`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-2 border-t border-slate-50 mt-2">
                                    <button
                                        onClick={() => setSelectedRequest(r)}
                                        className="px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this request?')) {
                                                try {
                                                    await deleteServiceRequest(r.id);
                                                    fetchRequests();
                                                } catch (error) {
                                                    console.error('Error deleting request:', error);
                                                    alert('Error deleting request');
                                                }
                                            }
                                        }}
                                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default RequestsView;
