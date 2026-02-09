import React, { useState, useEffect } from 'react';
import { Search, Loader2, Eye, CheckCircle2, AlertCircle, ShoppingBag, Calendar, User, CreditCard } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('http://localhost:8081/api/orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch orders`);
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error(err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            setUpdatingId(id);
            const res = await fetch(`http://localhost:8081/api/orders/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            showNotification('Order status updated successfully!', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredOrders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (loading && orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
                <h3 className="text-xl font-black text-gray-900">Loading Orders...</h3>
                <p className="text-gray-500 font-medium">Fetching the latest transactions from the database.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Stats Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">Monitor transactions and process customer shipments.</p>
                </div>

                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search order or email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-700 placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 flex items-center gap-4">
                    <AlertCircle size={24} />
                    <div>
                        <p className="font-bold tracking-tight">Failed to synchronize data</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                </div>
            )}

            {notification && (
                <div className={`fixed top-8 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-8 duration-300 ${notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <p className="font-bold text-sm tracking-tight">{notification.message}</p>
                </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-5">Order Identification</th>
                                <th className="px-8 py-5">Customer Profile</th>
                                <th className="px-8 py-5">Transaction Details</th>
                                <th className="px-8 py-5">Current Status</th>
                                <th className="px-8 py-5 text-center">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <ShoppingBag size={48} className="text-gray-200 mb-4" />
                                            <p className="text-gray-500 font-black text-lg">No orders found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black text-xs shrink-0">
                                                    #{order.id}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight font-mono">{order.orderNumber}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Calendar size={12} className="text-gray-400" />
                                                        <p className="text-[10px] text-gray-400 font-bold italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <User size={14} className="text-gray-400" />
                                                    <p className="text-sm font-bold text-gray-800">{order.customerName || 'Guest Customer'}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium ml-5">{order.customerEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-gray-900">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CreditCard size={14} className="text-gray-400" />
                                                <p className="text-sm tracking-tight italic">INR {order.totalAmount?.toLocaleString()}</p>
                                            </div>
                                            <p className="text-[9px] text-gray-400 uppercase tracking-widest ml-5">Taxes Included</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <select
                                                    disabled={updatingId === order.id}
                                                    className={`appearance-none font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/20 transition-all cursor-pointer border-2 ${order.status === 'SHIPPED' ? 'bg-green-50 border-green-100 text-green-700' :
                                                            order.status === 'CANCELLED' ? 'bg-red-50 border-red-100 text-red-700' :
                                                                order.status === 'PAID' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                                                    order.status === 'PENDING' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                                                                        'bg-orange-50 border-orange-100 text-orange-700'
                                                        }`}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                >
                                                    <option value="CREATED">CREATED</option>
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PAID">PAID</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                                {updatingId === order.id && <Loader2 className="animate-spin ml-2 text-orange-500" size={16} />}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => setSelectedOrderId(order.id)}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all"
                                                >
                                                    <Eye size={14} />
                                                    Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Info */}
            <div className="bg-orange-500 rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h4 className="text-2xl font-black mb-2">Inventory Sync Active</h4>
                    <p className="text-orange-100 text-sm font-medium max-w-md">Your dashboard is currently monitoring {orders.length} unique transactions. Shipments should be processed within 24 hours of payment status.</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="px-10 py-4 bg-white text-orange-600 rounded-2xl font-black text-sm hover:bg-orange-50 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                    Force Manual Refresh
                </button>
            </div>

            {selectedOrderId && (
                <OrderDetailsModal
                    orderId={selectedOrderId}
                    onClose={() => setSelectedOrderId(null)}
                />
            )}
        </div>
    );
};

export default AdminOrders;
