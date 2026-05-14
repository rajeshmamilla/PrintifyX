import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Package, CreditCard, Box, Truck, XCircle, CheckCircle2, Printer, Calendar, MapPin, Mail } from 'lucide-react';
import { fetchWithAuth } from "../../services/apiClient";
import { toast } from "sonner";

// Import images
import plasticBusinessCardsImg from "../../assets/products/plastic business cards.png";
import standardBusinessCardsImg from "../../assets/products/standard business cards.png";

const getProductImage = (productName: string) => {
    const nameStr = productName?.toLowerCase() || "";
    if (nameStr.includes("plastic")) return plasticBusinessCardsImg;
    if (nameStr.includes("standard")) return standardBusinessCardsImg;
    return null; // Box fallback
};

const OrderDetails: React.FC = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    const userId = localStorage.getItem('userId');
    const isUserValid = userId && userId !== "undefined" && userId !== "null";

    useEffect(() => {
        if (!isUserValid) {
            navigate('/login');
            return;
        }
        fetchOrderDetails();
    }, [orderId, isUserValid]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await fetchWithAuth(`/orders/${orderId}`);
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
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

        try {
            setCancelling(true);
            const res = await fetchWithAuth(`/orders/${orderId}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: "CANCELLED" }),
            });

            if (!res.ok) throw new Error("Failed to cancel order");
            toast.success("Order cancelled successfully");
            fetchOrderDetails();
        } catch (err: any) {
            toast.error(err.message || "Failed to cancel order");
        } finally {
            setCancelling(false);
        }
    };

    const getStatusSteps = (status: string) => {
        const stages = [
            { key: 'PAID', name: 'Payment Verified', icon: <CreditCard size={18} /> },
            { key: 'PROCESSING', name: 'In Production', icon: <Printer size={18} /> },
            { key: 'SHIPPED', name: 'Dispatched', icon: <Truck size={18} /> },
            { key: 'DELIVERED', name: 'Delivered', icon: <CheckCircle2 size={18} /> },
        ];

        const statusOrder = ['CREATED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        const currentIndex = statusOrder.indexOf(status);

        if (status === 'CANCELLED') {
            return [{ name: 'Order Cancelled', status: 'active', date: 'Cancelled', icon: <XCircle size={18} className="text-red-500" /> }];
        }

        return stages.map((stage) => {
            const stageOrder = statusOrder.indexOf(stage.key);
            let stepStatus: 'completed' | 'active' | 'pending' = 'pending';

            if (stageOrder < currentIndex) {
                stepStatus = 'completed';
            } else if (stageOrder === currentIndex) {
                stepStatus = 'active';
            }

            return {
                ...stage,
                status: stepStatus,
                date: stepStatus === 'completed' ? 'Verified' : stepStatus === 'active' ? 'In Progress' : 'Upcoming'
            };
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-700">
                <div className="relative">
                    <Loader2 className="animate-spin text-zinc-900 mb-6" size={56} strokeWidth={1.5} />
                    <div className="absolute inset-0 blur-xl bg-zinc-400/20 animate-pulse"></div>
                </div>
                <p className="font-bold text-zinc-500 uppercase tracking-[0.2em] text-xs">Syncing Order Data</p>
            </div>
        );
    }

    if (!order) return null;

    const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : 'N/A';

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section - Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
                <div className="flex items-start gap-5">
                    <button
                        onClick={() => navigate('/profile/orders')}
                        className="p-3 bg-white rounded-xl border border-zinc-200 hover:shadow-lg hover:border-zinc-300 transition-all group cursor-pointer"
                        title="Back to History"
                    >
                        <ChevronLeft size={20} className="text-zinc-500 group-hover:text-zinc-900 transition-colors" />
                    </button>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900">Order Details</h1>
                            <span className="px-3 py-1 bg-zinc-900 text-white rounded-lg text-xs font-black tracking-widest uppercase shadow-sm">
                                #{order.orderNumber}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-zinc-500">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span className="text-sm font-bold">{formattedDate}</span>
                            </div>
                            <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></div>
                            <div className="flex items-center gap-2">
                                <Package size={14} />
                                <span className="text-sm font-bold">{order.items?.length || 0} Products</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Cancel Action */}
                    {(order.status === "CREATED" || order.status === "PENDING" || order.status === "PAID") && (
                        <button
                            disabled={cancelling}
                            onClick={handleCancelOrder}
                            className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all text-xs font-bold uppercase tracking-widest border border-red-100 disabled:opacity-50 cursor-pointer shadow-sm group"
                        >
                            {cancelling ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} className="group-hover:scale-110 transition-transform" />}
                            {cancelling ? 'Processing...' : 'Cancel Order'}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Items & Address */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Items List */}
                    <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
                            <Package size={18} className="text-zinc-400" />
                            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900">Order Items</h2>
                        </div>
                        <div className="divide-y divide-zinc-100">
                            {order.items?.map((item: any) => {
                                const prodImg = getProductImage(item.productName);
                                return (
                                    <div key={item.id} className="p-6 hover:bg-zinc-50 transition-colors group">
                                        <div className="flex gap-6">
                                            <div className="h-24 w-24 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 overflow-hidden p-2">
                                                {prodImg ? 
                                                    <img src={prodImg} alt={item.productName} className="object-contain w-full h-full" /> : 
                                                    <Box size={24} strokeWidth={1} className="text-zinc-300" />
                                                }
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-2">
                                                    <h4 className="font-bold text-zinc-900">{item.productName}</h4>
                                                    <p className="font-black text-zinc-900">₹{item.totalPrice.toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-zinc-500 font-bold mb-4">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>Price: ₹{item.unitPrice.toLocaleString()}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/products/${item.productId || ''}`)}
                                                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-orange-600 transition-all"
                                                    >
                                                        Buy Again
                                                    </button>
                                                    <button className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:border-zinc-900 transition-all">
                                                        Review
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Simple Shipping Info */}
                    <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <MapPin size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Delivery Address</span>
                                </div>
                                <div className="pl-6 border-l-2 border-zinc-100">
                                    <p className="font-black text-zinc-900 mb-1">{order.shippingName || order.customerName}</p>
                                    <p className="text-sm text-zinc-500 font-bold leading-relaxed">
                                        {order.shippingAddressLine1} {order.shippingAddressLine2 && `, ${order.shippingAddressLine2}`}
                                        <br />
                                        {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Mail size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Contact Information</span>
                                </div>
                                <div className="pl-6 border-l-2 border-zinc-100 space-y-1">
                                    <p className="text-sm text-zinc-900 font-bold">{order.customerEmail}</p>
                                    <p className="text-sm text-zinc-900 font-bold">{order.customerPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tracking & Total */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Simplified Order Summary */}
                    <div className="bg-zinc-900 rounded-[2rem] p-8 text-white shadow-xl shadow-zinc-200">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Payment Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-zinc-400 font-bold text-sm">
                                <span>Subtotal</span>
                                <span>₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-green-400 font-bold text-sm">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="pt-4 border-t border-zinc-800">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Paid</p>
                                        <p className="text-3xl font-black tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-zinc-800 rounded-lg text-[10px] font-black text-green-400 uppercase tracking-wider">
                                        PAID
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simplified Status Tracker */}
                    <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-8">Order Status</h3>
                        <div className="space-y-6">
                            {getStatusSteps(order.status).map((step, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                        step.status === 'completed' ? 'bg-zinc-900 text-white' :
                                        step.status === 'active' ? 'bg-blue-600 text-white' :
                                        'bg-zinc-50 text-zinc-300'
                                    }`}>
                                        {step.status === 'completed' ? <CheckCircle2 size={16} /> : step.icon}
                                    </div>
                                    <div>
                                        <p className={`text-xs font-black uppercase tracking-wider ${
                                            step.status === 'pending' ? 'text-zinc-300' : 'text-zinc-900'
                                        }`}>{step.name}</p>
                                        <p className="text-[10px] font-bold text-zinc-400">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
