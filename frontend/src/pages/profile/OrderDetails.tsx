import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Package, CreditCard, AlertCircle, Box, Truck, XCircle, CheckCircle2, Printer } from 'lucide-react';
import { fetchWithAuth } from "../../services/apiClient";

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
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

            setNotification({ message: "Order cancelled successfully", type: "success" });
            fetchOrderDetails();
            setTimeout(() => setNotification(null), 3000);
        } catch (err: any) {
            setNotification({ message: err.message, type: "error" });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setCancelling(false);
        }
    };

    const getStatusSteps = (status: string) => {
        const stages = [
            { key: 'PAID', name: 'Payment Received', icon: <CreditCard size={18} /> },
            { key: 'PROCESSING', name: 'Printing', icon: <Printer size={18} /> },
            { key: 'SHIPPED', name: 'Shipped', icon: <Truck size={18} /> },
            { key: 'DELIVERED', name: 'Delivered', icon: <Package size={18} /> },
        ];

        const statusOrder = ['CREATED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        const currentIndex = statusOrder.indexOf(status);

        if (status === 'CANCELLED') {
            return [{ name: 'Order Cancelled', status: 'active', date: 'N/A', icon: <XCircle size={18} className="text-red-500" /> }];
        }

        return stages.map((stage) => {
            const stageOrder = statusOrder.indexOf(stage.key);
            let stepStatus: 'completed' | 'active' | 'pending' = 'pending';

            if (stageOrder < currentIndex) {
                stepStatus = 'completed';
            } else if (stageOrder === currentIndex) {
                if (stage.key === 'DELIVERED') {
                    stepStatus = 'active';
                } else {
                    stepStatus = 'completed';
                }
            } else if (stageOrder === currentIndex + 1 || (status === 'CREATED' && stage.key === 'PAID')) {
                stepStatus = 'active';
            }

            return {
                ...stage,
                status: stepStatus,
                date: stepStatus === 'completed' ? 'Done' : 'Pending'
            };
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="font-bold text-gray-500 uppercase tracking-wider text-xs">Loading order details...</p>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {notification && (
                <div className={`absolute top-0 right-0 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-8 duration-300 ${notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                    {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <p className="font-bold text-sm tracking-tight">{notification.message}</p>
                </div>
            )}

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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h3>
                    <p className="text-gray-500 font-medium max-w-xs mb-8">This order might not belong to your account or has been removed.</p>
                </div>
            )}

            {order && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Merged Layout) */}
                    <div className="lg:col-span-2">
                        {/* Master Wrap Card */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                            
                            {/* Order Contents Section */}
                            <div className="p-8 pb-6 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-semibold text-gray-900">Order Contents</h1>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold font-mono">#{order.orderNumber}</span>
                                </div>
                                <div className="space-y-4">
                                    {order.items?.map((item: any) => {
                                        const prodImg = getProductImage(item.productName);
                                        return (
                                        <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white transition-colors group">
                                            <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100 overflow-hidden text-gray-200 p-1 group-hover:shadow-md transition-shadow">
                                                {prodImg ? <img src={prodImg} alt={item.productName} className="object-contain w-full h-full drop-shadow-sm" /> : <Package size={28} strokeWidth={1} />}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.productName}</h4>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Qty</span>
                                                        <span className="text-xs font-semibold text-gray-900">{item.quantity} Units</span>
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-200"></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Unit Price</span>
                                                        <span className="text-xs font-semibold text-gray-900">₹{item.unitPrice.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col justify-center items-end gap-1">
                                                <div className="inline-flex px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold uppercase tracking-wider rounded border border-green-100">
                                                    Standard
                                                </div>
                                                <p className="text-lg font-bold text-blue-600">₹{item.totalPrice.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>

                            {/* Shipping section aligned nicely */}
                            <div className="p-8 pt-6 bg-gray-50/50 flex flex-col flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <CreditCard size={16} className="text-orange-500" />
                                    Shipping & Contact Details
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
                                    {(() => {
                                        const finalAddress = order.shippingAddress || fetchedAddress;
                                        return (
                                        <>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 mb-1">{order.customerName}</p>
                                                <p className="text-xs text-gray-500 font-medium mb-1">{order.customerEmail}</p>
                                                <p className="text-xs text-gray-500 font-medium">{order.phone || order.customerPhone || finalAddress?.phone || 'Contact not provided'}</p>
                                            </div>
                                            
                                            {finalAddress && (
                                                <div className="md:border-l md:border-gray-100 md:pl-6">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</p>
                                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                                        {finalAddress.addressLine1} {finalAddress.addressLine2}<br/>
                                                        {finalAddress.city}, {finalAddress.state} {finalAddress.pincode}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                        );
                                    })()}
                                </div>
                            </div>
                            
                            {/* Total Summary Row anchored at bottom of block */}
                            <div className="bg-gray-900 p-6 flex flex-row items-center justify-between text-white">
                                <span className="font-bold uppercase tracking-wider text-sm opacity-80">Total Bill Amount</span>
                                <div className="text-right">
                                    <p className="text-3xl font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-400 italic mt-0.5 font-bold uppercase tracking-wider">GST Included</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Status Tracking Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-200 shadow-sm relative overflow-hidden">
                            <h3 className="text-xl font-bold text-blue-900 uppercase tracking-wider mb-8 flex items-center gap-2">
                                <Box size={24} className="text-blue-600" />
                                Status
                            </h3>
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-blue-200 z-0" />
                                <div className="space-y-8 relative z-10">
                                    {getStatusSteps(order.status).map((step) => (
                                        <div key={step.name} className="flex items-start gap-4">
                                            <div className={`p-2 rounded-full border-4 border-blue-50 shadow-sm flex items-center justify-center shrink-0 ${
                                                step.status === 'completed' ? 'bg-green-500 text-white border-green-100' :
                                                step.status === 'active' ? 'bg-blue-500 text-white animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-100' :
                                                'bg-white text-blue-200 border-blue-100'
                                            }`}>
                                                {step.icon}
                                            </div>
                                            <div className="flex-grow pt-1">
                                                <div className="flex justify-between items-center">
                                                    <h4 className={`text-sm font-bold ${
                                                        step.status === 'pending' ? 'text-blue-300' : 'text-blue-900'
                                                    }`}>{step.name}</h4>
                                                </div>
                                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mt-0.5">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {(order.status === "CREATED" || order.status === "PENDING" || order.status === "PAID") && (
                                <div className="mt-6 pt-4 border-t border-blue-200 flex justify-end">
                                    <button
                                        disabled={cancelling}
                                        onClick={handleCancelOrder}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-xs font-semibold border border-transparent hover:border-red-100 disabled:opacity-50"
                                        title="Cancel Order"
                                    >
                                        {cancelling ? <Loader2 className="animate-spin" size={12} /> : <XCircle size={12} />}
                                        {cancelling ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
