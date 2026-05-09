import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Package, CreditCard, Box, Truck, XCircle, CheckCircle2, Printer, MapPin, Phone, Mail, Calendar } from 'lucide-react';
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
    const [fetchedAddress, setFetchedAddress] = useState<any>(null);

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

            const addrRes = await fetchWithAuth(`/addresses`);
            if (addrRes.ok) {
                const addrs = await addrRes.json();
                if (addrs && addrs.length > 0) {
                   setFetchedAddress(addrs.find((a:any) => a.isDefault) || addrs[0]);
                }
            }
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
                    {/* Secondary Actions */}
                    <button className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2 shadow-sm">
                        <Printer size={14} />
                        Invoice
                    </button>
                    
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
                <div className="lg:col-span-8 space-y-8">
                    {/* Items Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center shadow-md">
                                <Package size={16} />
                            </div>
                            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">Items in this shipment</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {order.items?.map((item: any) => {
                                const prodImg = getProductImage(item.productName);
                                return (
                                    <div key={item.id} className="group bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 overflow-hidden relative">
                                        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                                            {/* Thumbnail - Enhanced */}
                                            <div className="relative h-32 w-32 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 overflow-hidden p-3 group-hover:scale-105 transition-transform duration-700">
                                                {prodImg ? 
                                                    <img src={prodImg} alt={item.productName} className="object-contain w-full h-full drop-shadow-2xl" /> : 
                                                    <Box size={40} strokeWidth={1} className="text-zinc-200" />
                                                }
                                                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/5 to-transparent"></div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-black text-zinc-900 text-lg mb-2 group-hover:text-blue-600 transition-colors leading-tight">{item.productName}</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.customization?.sampleImageUrl && (
                                                                <a 
                                                                    href={item.customization.sampleImageUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <Printer size={12} /> View Artwork
                                                                </a>
                                                            )}
                                                            <div className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-zinc-500">
                                                                Standard Finish
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-black text-zinc-900 tracking-tight">₹{item.totalPrice.toLocaleString()}</p>
                                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Total</p>
                                                    </div>
                                                </div>

                                                <div className="mt-auto flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-50">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">Quantity</span>
                                                        <span className="text-sm font-black text-zinc-900">{item.quantity} Units</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-zinc-100 hidden sm:block"></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">Unit Price</span>
                                                        <span className="text-sm font-black text-zinc-900">₹{item.unitPrice.toLocaleString()}</span>
                                                    </div>
                                                    
                                                    {/* New Buttons as requested */}
                                                    <div className="ml-auto flex gap-2">
                                                        <button 
                                                            onClick={() => navigate(`/products/${item.productId || ''}`)}
                                                            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                                        >
                                                            Buy Again
                                                        </button>
                                                        <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-zinc-900 hover:text-zinc-900 transition-all">
                                                            Review
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shipping & Contact Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 space-y-6 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                    <MapPin size={20} className="text-orange-500" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Shipping To</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-base font-black text-zinc-900 tracking-tight">{order.shippingName || order.customerName}</p>
                                <p className="text-sm text-zinc-500 font-bold leading-relaxed">
                                    {(() => {
                                        const hasOrderAddress = order.shippingAddressLine1;
                                        if (hasOrderAddress) {
                                            return (
                                                <>
                                                    {order.shippingAddressLine1} {order.shippingAddressLine2 && `, ${order.shippingAddressLine2}`}
                                                    <br />
                                                    {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                                                </>
                                            );
                                        } else if (fetchedAddress) {
                                            return (
                                                <>
                                                    {fetchedAddress.addressLine1} {fetchedAddress.addressLine2 && `, ${fetchedAddress.addressLine2}`}
                                                    <br />
                                                    {fetchedAddress.city}, {fetchedAddress.state} - {fetchedAddress.pincode}
                                                </>
                                            );
                                        }
                                        return "No address specified";
                                    })()}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 space-y-6 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Mail size={20} className="text-blue-500" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Notification</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                        <Mail size={16} className="text-zinc-400 group-hover:text-blue-500" />
                                    </div>
                                    <p className="text-sm text-zinc-900 font-black tracking-tight">{order.customerEmail}</p>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                        <Phone size={16} className="text-zinc-400 group-hover:text-blue-500" />
                                    </div>
                                    <p className="text-sm text-zinc-900 font-black tracking-tight">{order.customerPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tracking & Total */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Status Tracker Card */}
                    <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-2xl shadow-zinc-200/30 relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 p-4 opacity-[0.05] rotate-12">
                            <Box size={140} strokeWidth={1} />
                        </div>

                        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400 mb-10 flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                            Track Shipment
                        </h3>

                        <div className="relative">
                            <div className="absolute left-[17px] top-4 bottom-4 w-[2px] bg-zinc-100 z-0">
                                <div 
                                    className="w-full bg-zinc-900 transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                                    style={{ height: `${Math.max(0, (getStatusSteps(order.status).filter(s => s.status === 'completed').length / 3) * 100)}%` }}
                                ></div>
                            </div>

                            <div className="space-y-8 relative z-10">
                                {getStatusSteps(order.status).map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-5 group">
                                        <div className={`w-9 h-9 rounded-full shadow-lg flex items-center justify-center shrink-0 transition-all duration-500 scale-100 group-hover:scale-110 ${
                                            step.status === 'completed' ? 'bg-zinc-900 text-white ring-4 ring-zinc-50' :
                                            step.status === 'active' ? 'bg-blue-600 text-white animate-pulse ring-4 ring-blue-50' :
                                            'bg-white text-zinc-300 border border-zinc-200'
                                        }`}>
                                            {React.cloneElement(step.icon as React.ReactElement<any>, { size: 16 })}
                                        </div>
                                        <div className="flex-grow pt-1">
                                            <h4 className={`text-xs font-black uppercase tracking-widest ${
                                                step.status === 'pending' ? 'text-zinc-300' : 'text-zinc-900'
                                            }`}>{step.name}</h4>
                                            <p className={`text-[11px] font-black tracking-tight mt-1 px-2 py-0.5 rounded w-fit ${
                                                step.status === 'completed' ? 'bg-green-50 text-green-600' : 
                                                step.status === 'active' ? 'bg-blue-50 text-blue-600' : 'text-zinc-400'
                                            }`}>{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Total Summary Card */}
                    <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-zinc-900/40 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 p-6 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
                            <CreditCard size={180} strokeWidth={1} />
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">Order Summary</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-zinc-400 font-bold text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-green-400 font-bold text-sm">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="pt-4 border-t border-zinc-800">
                                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Total Amount</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black tracking-tighter">₹{order.totalAmount.toLocaleString()}</span>
                                        <span className="text-xs font-black text-zinc-500">INR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Taxation</span>
                                    <span className="text-xs font-black text-zinc-300 tracking-tight">GST Included (18%)</span>
                                </div>
                                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-green-400 shadow-inner">
                                    <CheckCircle2 size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
