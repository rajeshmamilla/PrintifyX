import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Package, Tag, CreditCard, AlertCircle } from 'lucide-react';

const OrderDetails: React.FC = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/orders/${orderId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            if (!res.ok) throw new Error('Failed to fetch order details');
            const data = await res.json();

            // Check if order belongs to user
            if (data.user && data.user.id.toString() !== userId) {
                navigate('/profile/orders');
                return;
            }

            setOrder(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch order details');
            // navigate('/profile/orders'); // Don't navigate away, show the error
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Loading order items...</p>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <button
                onClick={() => navigate('/profile/orders')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors group"
            >
                <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:shadow-md transition-all">
                    <ChevronLeft size={16} />
                </div>
                Back to Orders
            </button>

            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                    <AlertCircle size={24} />
                    <div>
                        <p className="font-bold tracking-tight">Access Failure</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                </div>
            )}

            {!order && !loading && !error && (
                <div className="bg-white rounded-[2rem] p-16 flex flex-col items-center text-center border border-gray-100">
                    <AlertCircle size={48} className="text-gray-200 mb-4" />
                    <h3 className="text-xl font-black text-gray-900 mb-2">Order not found</h3>
                    <p className="text-gray-500 font-medium max-w-xs mb-8">This order might not belong to your account or has been removed.</p>
                </div>
            )}

            {order && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="relative z-10">
                                <h1 className="text-2xl font-black text-gray-900 mb-6">Order Contents</h1>
                                <div className="space-y-4">
                                    {order.items?.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 p-4 border border-gray-50 rounded-2xl bg-gray-50/30">
                                            <div className="h-20 w-20 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                                                <Package size={32} className="text-gray-200" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="font-black text-gray-900 text-sm">{item.productName}</h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Qty: <span className="text-gray-900">{item.quantity}</span></p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Price: <span className="text-gray-900">₹{item.unitPrice.toLocaleString()}</span></p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col justify-center">
                                                <p className="text-lg font-black text-orange-600">₹{item.totalPrice.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl shadow-gray-200">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Tag size={20} className="text-orange-500" />
                                Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold border-b border-gray-800 pb-4">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Order ID</span>
                                    <span className="font-mono text-orange-500">#{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold border-b border-gray-800 pb-4">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Status</span>
                                    <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[10px] uppercase tracking-tighter">
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-gray-400 uppercase tracking-widest text-[10px] font-black">Total Payment</span>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-white">₹{order.totalAmount.toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-500 italic mt-1 font-bold">GST Included</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CreditCard size={16} className="text-orange-500" />
                                Shipping Info
                            </h3>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-gray-800 leading-tight">{order.customerName}</p>
                                <p className="text-xs text-gray-500 font-medium">{order.customerEmail}</p>
                                <p className="text-xs text-gray-500 font-medium">{order.customerPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
