import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Package, Truck, Box, ArrowRight, ShoppingBag } from 'lucide-react';

const TrackOrderPage: React.FC = () => {
    const location = useLocation();

    // Mock order data
    const orderDetails = {
        orderId: location.state?.orderId || `#PX${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Confirmed',
        estimatedDelivery: 'Feb 24, 2026',
        steps: [
            { name: 'Order Placed', status: 'completed', date: 'Feb 17, 2026', icon: <ShoppingBag size={20} /> },
            { name: 'Processing', status: 'active', date: 'Feb 18, 2026', icon: <Box size={20} /> },
            { name: 'Shipped', status: 'pending', date: 'Feb 20, 2026', icon: <Truck size={20} /> },
            { name: 'Delivered', status: 'pending', date: 'Feb 24, 2026', icon: <Package size={20} /> },
        ]
    };

    return (
        <div className="min-h-screen bg-[#f5f8fb] flex flex-col">
            <Header />
            <Navbar />

            <main className="flex-grow max-w-[800px] mx-auto px-6 py-16 w-full">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-10 text-center mb-8">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank you for your order!</h1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Your request has been received and is being processed by our professional printing team.
                    </p>

                    <div className="inline-flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-md border border-gray-100">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                        <span className="font-bold text-gray-900">{orderDetails.orderId}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-10">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">Track Status</h2>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
                            <p className="font-bold text-gray-900">{orderDetails.estimatedDelivery}</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Timeline Connector */}
                        <div className="absolute left-[26px] top-0 bottom-0 w-0.5 bg-gray-100 z-0" />

                        <div className="space-y-10 relative z-10">
                            {orderDetails.steps.map((step, index) => (
                                <div key={index} className="flex items-start gap-8">
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
                                            {step.status === 'completed' && 'Package has departed source facility'}
                                            {step.status === 'active' && 'Expert quality checking in progress'}
                                            {step.status === 'pending' && 'Pending next step'}
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
