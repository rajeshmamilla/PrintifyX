import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Package, Truck, Box, ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import { fetchWithAuth } from '../services/apiClient';

const TrackOrderPage: React.FC = () => {
    const location = useLocation();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = location.state?.orderId;

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }
            try {
                // We need to find the order by its orderNumber (which is PX... or whatever)
                // Actually, the API might need the ID. Let's try fetching all user orders and finding this one
                // Or better, if the backend supports fetching by orderNumber. 
                // Given current endpoints, let's assume we can fetch by ID if orderId is numeric,
                // or we search in the user's order list.
                const res = await fetchWithAuth(`/orders`);
                if (res.ok) {
                    const orders = await res.json();
                    const foundOrder = orders.find((o: any) => o.orderNumber === orderId || o.id.toString() === orderId.toString());
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        setError("Order not found");
                    }
                } else {
                    setError("Failed to fetch order details");
                }
            } catch (err) {
                setError("An error occurred while tracking your order");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const getStatusSteps = (status: string) => {
        const stages = [
            { key: 'PAID', name: 'Payment Received', icon: <CreditCard size={20} /> },
            { key: 'PROCESSING', name: 'Processing', icon: <Box size={20} /> },
            { key: 'SHIPPED', name: 'Shipped', icon: <Truck size={20} /> },
            { key: 'DELIVERED', name: 'Delivered', icon: <Package size={20} /> },
        ];

        const statusOrder = ['CREATED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        const currentIndex = statusOrder.indexOf(status);

        if (status === 'CANCELLED') {
            return [{ name: 'Order Cancelled', status: 'active', date: 'N/A', icon: <Box size={20} className="text-red-500" /> }];
        }

        return stages.map((stage) => {
            const stageOrder = statusOrder.indexOf(stage.key);
            let stepStatus: 'completed' | 'active' | 'pending' = 'pending';

            // Logic:
            // 1. If status is AFTER this stage, it's completed.
            // 2. If status is EQUAL to this stage, it's completed (because PAID means payment IS done).
            //    BUT if it's the very last stage (DELIVERED), it's active.
            // 3. The NEXT logical stage after 'status' should be active.

            if (stageOrder < currentIndex) {
                stepStatus = 'completed';
            } else if (stageOrder === currentIndex) {
                // If we are EXACTLY at this stage, it's done (except for the final delivery)
                if (stage.key === 'DELIVERED') {
                    stepStatus = 'active';
                } else {
                    stepStatus = 'completed';
                }
            } else if (stageOrder === currentIndex + 1 || (status === 'CREATED' && stage.key === 'PAID')) {
                // This is the step we are currently waiting for or working on
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
            <div className="min-h-screen bg-[#f5f8fb] flex flex-col">
                <Header />
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
                <Footer />
            </div>
        );
    }

    if (!orderId || !order) {
        return (
            <div className="min-h-screen bg-[#f5f8fb] flex flex-col">
                <Header />
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-6 text-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">{error || "Order context missing"}</h1>
                        <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const steps = getStatusSteps(order.status);

    return (
        <div className="min-h-screen bg-[#f5f8fb] flex flex-col">
            <Header />
            <Navbar />

            <main className="flex-grow max-w-[800px] mx-auto px-6 py-16 w-full">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-10 text-center mb-8">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center mx-auto">
                        Order #{order.orderNumber}
                    </h1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Current Status: <span className="font-bold text-gray-900 uppercase tracking-tight">{order.status}</span>
                    </p>

                    <div className="inline-flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-md border border-gray-100">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Expected Timeline</span>
                        <span className="font-bold text-gray-900">4-5 Business Days</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-10">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">Track Status</h2>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status as of</p>
                            <p className="font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Timeline Connector */}
                        <div className="absolute left-[26px] top-0 bottom-0 w-0.5 bg-gray-100 z-0" />

                        <div className="space-y-10 relative z-10">
                            {steps.map((step) => (
                                <div key={step.name} className="flex items-start gap-8">
                                    <div className={`p-3 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${step.status === 'completed' ? 'bg-gray-900 text-white' :
                                        step.status === 'active' ? 'bg-blue-600 text-white animate-pulse' :
                                            'bg-gray-100 text-gray-400'
                                        }`}>
                                        {step.icon}
                                    </div>
                                    <div className="flex-grow pt-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className={`font-bold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>{step.name}</h3>
                                            <span className="text-xs font-bold text-gray-400">{step.date}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {step.status === 'completed' && 'Stage verified and completed'}
                                            {step.status === 'active' && 'Currently in this stage'}
                                            {step.status === 'pending' && 'Scheduled for next stage'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 pt-10 border-t border-gray-50 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/"
                            className="flex-grow flex items-center justify-center gap-2 py-4 px-6 bg-gray-900 text-white font-bold text-sm rounded-md hover:bg-black transition-all"
                        >
                            Back to Home
                        </Link>
                        <Link
                            to="/profile/orders"
                            className="flex-grow flex items-center justify-center gap-2 py-4 px-6 border border-gray-200 text-gray-700 font-bold text-sm rounded-md hover:bg-gray-50 transition-all font-bold"
                        >
                            View All Orders <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TrackOrderPage;
