import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { cartService } from '../services/cart.service';
import { fetchWithAuth } from '../services/apiClient';
import { CreditCard, Wallet, Truck, Landmark, CheckCircle2, AlertCircle, Loader2, User, Phone, MapPin, Home, Info, Hash, Map } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [showAddressList, setShowAddressList] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isFetchingAddresses, setIsFetchingAddresses] = useState(false);

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
                setIsFetchingAddresses(true);
                const res = await fetchWithAuth('/addresses');
                if (res.ok) {
                    const addresses = await res.json();
                    setSavedAddresses(addresses);
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
                setIsFetchingAddresses(false);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, [userId]);

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
            setNotification({ message: 'Please fill in all required shipping address fields.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

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
            await cartService.checkout(selectedMethod, formData);

            setNotification({ message: 'Order placed successfully!', type: 'success' });
            setTimeout(() => {
                setNotification(null);
                // Dispatch event to update cart count in header
                window.dispatchEvent(new Event("cartUpdated"));
                navigate('/profile/orders');
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
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Checkout</h1>
                    <p className="text-gray-500 font-medium italic">Complete your order details below</p>
                </div>

                {notification && (
                    <div className={`fixed top-24 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border animate-in slide-in-from-right-8 duration-300 ${notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                        }`}>
                        {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <p className="font-bold text-sm tracking-tight">{notification.message}</p>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT: Address Form */}
                    <div className="w-full lg:w-2/3 bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-xs">1</span>
                                Shipping Address
                            </h2>
                            {savedAddresses.length > 0 && (
                                <button 
                                    type="button"
                                    onClick={() => setShowAddressList(!showAddressList)}
                                    className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                                >
                                    <MapPin size={12} /> {showAddressList ? "Hide Saved" : "Select Saved Address"}
                                </button>
                            )}
                        </div>

                        {showAddressList && savedAddresses.length > 0 && (
                            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Your Saved Addresses</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {savedAddresses.map((addr) => (
                                        <div 
                                            key={addr.id}
                                            onClick={() => {
                                                setFormData({
                                                    name: addr.name || '',
                                                    phone: addr.phone || '',
                                                    addressLine1: addr.addressLine1 || '',
                                                    addressLine2: addr.addressLine2 || '',
                                                    city: addr.city || '',
                                                    state: addr.state || '',
                                                    pincode: addr.pincode || ''
                                                });
                                                setShowAddressList(false);
                                                setNotification({ message: "Address applied!", type: "success" });
                                                setTimeout(() => setNotification(null), 2000);
                                            }}
                                            className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 hover:shadow-md transition-all group"
                                        >
                                            <p className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{addr.name}</p>
                                            <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{addr.addressLine1}, {addr.city}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="name"
                                            className="h-12 pl-12 border-gray-200 focus:ring-0 focus:border-gray-900 transition-all rounded-xl"
                                            placeholder="Enter full name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="phone"
                                            className="h-12 pl-12 border-gray-200 focus:ring-0 focus:border-gray-900 transition-all rounded-xl"
                                            placeholder="10-digit mobile number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="address1" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        Street Address <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="address1"
                                            className="h-12 pl-12 border-gray-200 focus:ring-0 focus:border-gray-900 transition-all rounded-xl"
                                            placeholder="House No., Building, Street, Area"
                                            value={formData.addressLine1}
                                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="address2" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Landmark (Optional)</Label>
                                    <div className="relative">
                                        <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="address2"
                                            className="h-12 pl-12 border-gray-200 focus:ring-0 focus:border-gray-900 transition-all rounded-xl"
                                            placeholder="e.g. Near Apollo Hospital"
                                            value={formData.addressLine2}
                                            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        City <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="city"
                                            className="h-12 pl-12 border-gray-200 focus:ring-0 focus:border-gray-900 transition-all rounded-xl"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        State <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="state"
                                            className="h-12 pl-12 border-gray-200 focus:ring-0 focus:border-gray-900 transition-all rounded-xl"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pincode" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                                        Pincode <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="pincode"
                                            className="h-12 pl-12 border-gray-200 focus:ring-0 focus:border-gray-900 transition-all rounded-xl"
                                            placeholder="6-digit pincode"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: Payment Options */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-[10px]">2</span>
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`group relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${selectedMethod === method.id
                                            ? 'border-gray-900 bg-gray-50 shadow-sm ring-1 ring-gray-900'
                                            : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/50'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg transition-colors ${selectedMethod === method.id ? 'bg-white text-gray-900 shadow-sm' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'}`}>
                                            {method.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-bold text-xs ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {method.name}
                                            </span>
                                            {method.id === 'razorpay' && <span className="text-[9px] text-gray-400 font-medium">UPI, Cards, Netbanking</span>}
                                        </div>
                                        <div className="ml-auto">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? 'border-gray-900 bg-gray-900' : 'border-gray-200 group-hover:border-gray-300'
                                                }`}>
                                                {selectedMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={handleAddressSubmit}
                                disabled={loading}
                                className="w-full mt-6 h-12 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? 'PROCESSING...' : 'CHECKOUT'}
                            </Button>
                            <p className="text-[10px] text-gray-400 text-center mt-4 font-bold uppercase tracking-wider">
                                Secure Encrypted Transaction
                            </p>
                        </div>

                        {/* Order Summary Placeholder */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Order Summary</h3>
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
                                    <span className="font-semibold text-lg text-gray-900">₹{cartTotal.toLocaleString()}</span>
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
