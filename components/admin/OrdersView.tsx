import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Loader2, Eye, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';
import { Order } from '../../services/supabase';
import { getOrders, updateOrderStatus } from '../../services/apiService';

const OrdersView: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: Order['status']) => {
        try {
            const updated = await updateOrderStatus(id, status);
            setOrders(orders.map(o => o.id === updated.id ? updated : o));
            if (selectedOrder?.id === id) {
                setSelectedOrder(updated);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone.includes(searchTerm) ||
        order.id.includes(searchTerm)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'processing': return <Truck className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Orders</h2>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Order ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Customer</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Total</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-slate-500">
                                        {order.id.slice(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{order.customer_name}</div>
                                        <div className="text-sm text-slate-500">{order.customer_phone}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-teal-600 dark:text-teal-400">
                                        {order.total_amount.toFixed(3)} KWD
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Order Details
                            </h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Customer Info</h4>
                                    <p className="text-slate-600 dark:text-slate-400">Name: {selectedOrder.customer_name}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Phone: {selectedOrder.customer_phone}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Address: {selectedOrder.customer_address}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Order Info</h4>
                                    <p className="text-slate-600 dark:text-slate-400">ID: {selectedOrder.id}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                    <div className="mt-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as Order['status'])}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Items</h4>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-100 dark:bg-slate-800">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Product</th>
                                                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Quantity</th>
                                                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Price</th>
                                                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {selectedOrder.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3 text-slate-900 dark:text-white">{item.product_title}</td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.price.toFixed(3)}</td>
                                                    <td className="px-4 py-3 text-slate-900 dark:text-white text-right">{(item.price * item.quantity).toFixed(3)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-100 dark:bg-slate-800 font-bold">
                                            <tr>
                                                <td colSpan={3} className="px-4 py-3 text-right text-slate-900 dark:text-white">Total Amount</td>
                                                <td className="px-4 py-3 text-right text-teal-600 dark:text-teal-400">{selectedOrder.total_amount.toFixed(3)} KWD</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default OrdersView;
