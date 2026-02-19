import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { cartService } from '../services/cart.service';
import { fetchWithAuth } from '../services/apiClient';
import { CreditCard, Wallet, Truck, Landmark, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AddressFormData {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
}

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [selectedMethod, setSelectedMethod] = useState<string>('upi');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState<AddressFormData>({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: ''
    });

    const userId = localStorage.getItem('userId');
    const isUserValid = userId && userId !== "undefined" && userId !== "null";

    useEffect(() => {
        const fetchData = async () => {
            if (!isUserValid) {
                navigate('/login');
                return;
            }
            try {
                // Fetch Cart Total
                const cart = await cartService.getCart();
                if (cart && cart.items) {
                    const total = cart.items.reduce((acc: number, item: any) => acc + item.totalPrice, 0);
                    setCartTotal(total);
                }

                // Fetch Saved Addresses for Auto-fill
                const res = await fetchWithAuth('/addresses');
                if (res.ok) {
                    const addresses = await res.json();
                    if (addresses.length > 0) {
                        const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
                        setFormData({
                            name: defaultAddr.name || '',
                            phone: defaultAddr.phone || '',
                            addressLine1: defaultAddr.addressLine1 || '',
                            addressLine2: defaultAddr.addressLine2 || '',
                            city: defaultAddr.city || '',
                            state: defaultAddr.state || '',
                            pincode: defaultAddr.pincode || ''
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, [userId]);

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            // Save address (if user modified it or for the first time)
            const res = await fetchWithAuth('/addresses', {
                method: 'POST',
                body: JSON.stringify({ ...formData, isDefault: false })
            });

            if (!res.ok) throw new Error('Failed to save address');

            setNotification({ message: 'Saving address...', type: 'success' });

            // Now perform actual checkout to create the order
            const orderRes = await cartService.checkout();

            setNotification({ message: 'Order placed successfully!', type: 'success' });
            setTimeout(() => {
                setNotification(null);
                // Dispatch event to update cart count in header
                window.dispatchEvent(new Event("cartUpdated"));
                navigate('/track-order', { state: { orderId: orderRes.orderNumber } });
            }, 1500);
        } catch (err: any) {
            setNotification({ message: err.message, type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        { id: 'upi', name: 'UPI', icon: <Wallet size={20} /> },
        { id: 'card', name: 'Debit / Credit Card', icon: <CreditCard size={20} /> },
        { id: 'cod', name: 'Cash On Delivery', icon: <Truck size={20} /> },
        { id: 'razorpay', name: 'Razorpay', icon: <Landmark size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[#f5f8fb]">
            <Header />
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                {notification && (
                    <div className={`fixed top-24 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border animate-in slide-in-from-right-8 duration-300 ${notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                        }`}>
                        {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <p className="font-bold text-sm tracking-tight">{notification.message}</p>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT: Address Form */}
                    <div className="w-full lg:w-2/3 bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Address</h2>
                        <form onSubmit={handleAddressSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-900 transition-all font-medium text-gray-700"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-900 transition-all font-medium text-gray-700"
                                        placeholder="10-digit mobile number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Street Address</label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-900 transition-all font-medium text-gray-700"
                                        placeholder="House No., Building, Street, Area"
                                        value={formData.addressLine1}
                                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Landmark (Optional)</label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-900 transition-all font-medium text-gray-700"
                                        placeholder="e.g. Near Apollo Hospital"
                                        value={formData.addressLine2}
                                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">City</label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-900 transition-all font-medium text-gray-700"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">State</label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-900 transition-all font-medium text-gray-700"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pincode</label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-900 transition-all font-medium text-gray-700"
                                        placeholder="6-digit pincode"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: Payment Options */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>
                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`flex items-center gap-4 p-4 border rounded-md cursor-pointer transition-all ${selectedMethod === method.id
                                            ? 'border-gray-900 bg-gray-50 shadow-sm'
                                            : 'border-gray-100 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {method.icon}
                                        </div>
                                        <span className={`font-bold text-sm ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {method.name}
                                        </span>
                                        <div className="ml-auto">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === method.id ? 'border-gray-900' : 'border-gray-300'
                                                }`}>
                                                {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleAddressSubmit}
                                disabled={loading}
                                className="w-full mt-8 py-4 bg-gray-900 text-white font-bold text-sm rounded-md hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 size={18} className="animate-spin" />}
                                {loading ? 'PROCESSING...' : 'COMPLETE PURCHASE'}
                            </button>
                            <p className="text-[10px] text-gray-400 text-center mt-4 font-bold uppercase tracking-widest">
                                Secure Encrypted Transaction
                            </p>
                        </div>

                        {/* Order Summary Placeholder */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-bold text-green-600 uppercase text-[10px]">Free</span>
                                </div>
                                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-black text-lg text-gray-900">₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentPage;
