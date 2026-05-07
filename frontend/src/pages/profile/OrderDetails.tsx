import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Package, CreditCard, AlertCircle, Box, Truck, XCircle, CheckCircle2, Printer, MapPin, Phone, Mail, Calendar } from 'lucide-react';
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
    const [error, setError] = useState<string | null>(null);
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
            setError(err.message || 'Failed to fetch order details');
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
            { key: 'PAID', name: 'Payment Verified', icon: <CreditCard size={16} /> },
            { key: 'PROCESSING', name: 'In Production', icon: <Printer size={16} /> },
            { key: 'SHIPPED', name: 'Dispatched', icon: <Truck size={16} /> },
            { key: 'DELIVERED', name: 'Delivered', icon: <CheckCircle2 size={16} /> },
        ];

        const statusOrder = ['CREATED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        const currentIndex = statusOrder.indexOf(status);

        if (status === 'CANCELLED') {
            return [{ name: 'Order Cancelled', status: 'active', date: 'Cancelled', icon: <XCircle size={16} className="text-red-500" /> }];
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
                    <Loader2 className="animate-spin text-zinc-900 mb-6" size={48} strokeWidth={1.5} />
                    <div className="absolute inset-0 blur-xl bg-zinc-400/20 animate-pulse"></div>
                </div>
                <p className="font-bold text-zinc-400 uppercase tracking-[0.2em] text-[10px]">Syncing Order Data</p>
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
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section - More Compact */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/profile/orders')}
                        className="p-2 bg-white rounded-lg border border-zinc-100 hover:shadow-md transition-all group cursor-pointer"
                        title="Back to History"
                    >
                        <ChevronLeft size={16} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-xl font-black tracking-tight text-zinc-900">Order Details</h1>
                            <span className="px-2 py-0.5 bg-zinc-900 text-white rounded-full text-[9px] font-bold tracking-widest uppercase">
                                #{order.orderNumber}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-400">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span className="text-[10px] font-semibold">{formattedDate}</span>
                            </div>
                            <div className="w-1 h-1 bg-zinc-200 rounded-full"></div>
                            <div className="flex items-center gap-1">
                                <Package size={12} />
                                <span className="text-[10px] font-semibold">{order.items?.length || 0} Items</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cancel Action - More Compact */}
                {(order.status === "CREATED" || order.status === "PENDING" || order.status === "PAID") && (
                    <button
                        disabled={cancelling}
                        onClick={handleCancelOrder}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest border border-red-100 disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                        {cancelling ? <Loader2 className="animate-spin" size={12} /> : <XCircle size={12} />}
                        {cancelling ? 'Syncing...' : 'Cancel Order'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Items & Address (Column 1-8) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Items Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-zinc-100 rounded flex items-center justify-center">
                                <Package size={12} className="text-zinc-600" />
                            </div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Items Ordered</h2>
                        </div>
                        
                        <div className="space-y-3">
                            {order.items?.map((item: any) => {
                                const prodImg = getProductImage(item.productName);
                                return (
                                    <div key={item.id} className="group relative bg-white border border-zinc-100 rounded-2xl p-4 hover:shadow-lg hover:shadow-zinc-200/30 transition-all duration-300">
                                        <div className="flex gap-4">
                                            {/* Thumbnail - Compact */}
                                            <div className="relative h-20 w-20 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0 border border-zinc-100 overflow-hidden p-2 group-hover:scale-105 transition-transform duration-500">
                                                {prodImg ? 
                                                    <img src={prodImg} alt={item.productName} className="object-contain w-full h-full drop-shadow-md" /> : 
                                                    <Box size={24} strokeWidth={1} className="text-zinc-300" />
                                                }
                                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/5 to-transparent"></div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col py-0.5">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-zinc-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{item.productName}</h4>
                                                        {item.customization?.sampleImageUrl && (
                                                            <a 
                                                                href={item.customization.sampleImageUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors"
                                                            >
                                                                <Printer size={8} /> View Design
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="text-base font-black text-zinc-900">₹{item.totalPrice.toLocaleString()}</p>
                                                </div>

                                                <div className="mt-auto flex items-center gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Qty</span>
                                                        <span className="text-[11px] font-bold text-zinc-900">{item.quantity} Units</span>
                                                    </div>
                                                    <div className="w-px h-5 bg-zinc-100"></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">Unit Cost</span>
                                                        <span className="text-[11px] font-bold text-zinc-900">₹{item.unitPrice.toLocaleString()}</span>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <div className="px-2 py-0.5 bg-zinc-50 border border-zinc-100 rounded text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                                                            Standard Finish
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shipping & Contact Grid - Compact */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-orange-500" />
                                <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">Delivery Information</h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-zinc-900">{order.shippingName || order.customerName}</p>
                                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                                    {(() => {
                                        const hasOrderAddress = order.shippingAddressLine1;
                                        if (hasOrderAddress) {
                                            return (
                                                <>
                                                    {order.shippingAddressLine1} {order.shippingAddressLine2}, {order.shippingCity}, {order.shippingState} {order.shippingPincode}
                                                </>
                                            );
                                        } else if (fetchedAddress) {
                                            return (
                                                <>
                                                    {fetchedAddress.addressLine1} {fetchedAddress.addressLine2}, {fetchedAddress.city}, {fetchedAddress.state} {fetchedAddress.pincode}
                                                </>
                                            );
                                        }
                                        return "No address specified";
                                    })()}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-blue-500" />
                                <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">Contact Details</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={12} className="text-zinc-400" />
                                    <p className="text-[11px] text-zinc-900 font-bold tracking-tight">{order.customerEmail}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={12} className="text-zinc-400" />
                                    <p className="text-[11px] text-zinc-900 font-bold tracking-tight">{order.customerPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Tracking & Total (Column 9-12) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Status Tracker Card - Compact */}
                    <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-xl shadow-zinc-200/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                            <Box size={80} strokeWidth={1} />
                        </div>

                        <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            Track shipment
                        </h3>

                        <div className="relative">
                            <div className="absolute left-[13px] top-4 bottom-4 w-[1.5px] bg-zinc-100 z-0">
                                <div 
                                    className="w-full bg-zinc-900 transition-all duration-1000 ease-in-out" 
                                    style={{ height: `${Math.max(0, (getStatusSteps(order.status).filter(s => s.status === 'completed').length / 3) * 100)}%` }}
                                ></div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {getStatusSteps(order.status).map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className={`w-7 h-7 rounded-full shadow-md flex items-center justify-center shrink-0 transition-all duration-500 ${
                                            step.status === 'completed' ? 'bg-zinc-900 text-white ring-4 ring-zinc-50' :
                                            step.status === 'active' ? 'bg-blue-600 text-white animate-pulse ring-4 ring-blue-50' :
                                            'bg-white text-zinc-300 border border-zinc-100'
                                        }`}>
                                            {React.cloneElement(step.icon as React.ReactElement, { size: 12 })}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className={`text-[10px] font-black uppercase tracking-widest ${
                                                step.status === 'pending' ? 'text-zinc-300' : 'text-zinc-900'
                                            }`}>{step.name}</h4>
                                            <p className={`text-[9px] font-bold tracking-tight mt-0.5 ${
                                                step.status === 'completed' ? 'text-green-600' : 
                                                step.status === 'active' ? 'text-blue-500' : 'text-zinc-400'
                                            }`}>{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Total Summary Card - Compact */}
                    <div className="bg-zinc-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-zinc-900/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <CreditCard size={100} strokeWidth={1} />
                        </div>
                        
                        <div className="relative z-10 space-y-5">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Final Invoice</span>
                            </div>

                            <div>
                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Grand Total</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black tracking-tighter">₹{order.totalAmount.toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-zinc-500">INR</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Taxation</span>
                                    <span className="text-[9px] font-bold text-zinc-300 tracking-tight">GST Included (18%)</span>
                                </div>
                                <CheckCircle2 className="text-green-400" size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
