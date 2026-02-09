import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Loader2, AlertCircle, Home, Phone, User } from 'lucide-react';

interface Address {
    id?: number;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

const Addresses: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Form state
    const [formData, setFormData] = useState<Address>({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });

    const userId = localStorage.getItem('token');

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8081/api/addresses', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userId || ''
                }
            });
            if (!res.ok) throw new Error('Failed to fetch addresses');
            const data = await res.json();
            setAddresses(data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8081/api/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userId || ''
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to save address');

            setNotification({ message: 'Address saved successfully', type: 'success' });
            setIsAdding(false);
            setFormData({ name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false });
            fetchAddresses();
            setTimeout(() => setNotification(null), 3000);
        } catch (err: any) {
            setNotification({ message: err.message, type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            const res = await fetch(`http://localhost:8081/api/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userId || ''
                }
            });

            if (!res.ok) throw new Error('Failed to delete address');

            setNotification({ message: 'Address removed', type: 'success' });
            fetchAddresses();
            setTimeout(() => setNotification(null), 3000);
        } catch (err: any) {
            setNotification({ message: err.message, type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Locating your saved spots...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Saved Addresses</h1>
                    <p className="text-gray-500 font-medium italic mt-1 text-sm">Manage your shipping destinations for faster checkout.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-100"
                    >
                        <Plus size={18} />
                        Add New
                    </button>
                )}
            </div>

            {notification && (
                <div className={`fixed top-24 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-8 duration-300 ${notification.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <p className="font-bold text-sm tracking-tight">{notification.message}</p>
                </div>
            )}

            {isAdding && (
                <div className="bg-white rounded-[2rem] p-8 border-2 border-orange-500/20 shadow-xl animate-in zoom-in duration-300">
                    <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin size={24} className="text-orange-500" />
                        New Shipping Address
                    </h2>
                    <form onSubmit={handleSaveAddress} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-700"
                                    placeholder="e.g. Rahul Sharma"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-700"
                                    placeholder="10-digit number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Line 1 (House No, Building, Street)</label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-700"
                                    placeholder="e.g. Flat 101, Printify Apartments"
                                    value={formData.addressLine1}
                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Line 2 (Landmark, Locality)</label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-700"
                                    placeholder="Optional"
                                    value={formData.addressLine2}
                                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-700"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-700"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-gray-700"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    <span className="ml-3 text-xs font-black text-gray-900 uppercase tracking-widest">Set as default address</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-10 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl"
                            >
                                Create Address
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.length === 0 && !isAdding && (
                    <div className="md:col-span-2 bg-white rounded-[2rem] p-16 flex flex-col items-center text-center border border-dashed border-gray-200">
                        <MapPin size={48} className="text-gray-200 mb-4" />
                        <h3 className="text-xl font-black text-gray-900 mb-2">No addresses saved</h3>
                        <p className="text-gray-500 font-medium max-w-xs">Add a shipping address to speed up your future orders.</p>
                    </div>
                )}

                {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative group hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                        {addr.isDefault && (
                            <div className="absolute top-6 right-6 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-200">
                                Default
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-800">
                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                    <User size={18} />
                                </div>
                                <span className="font-black text-lg">{addr.name}</span>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg mt-0.5">
                                    <Home size={18} className="text-gray-400" />
                                </div>
                                <div className="text-sm text-gray-600 font-medium leading-relaxed">
                                    <p className="font-bold text-gray-900">{addr.addressLine1}</p>
                                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2 text-sm text-gray-500 font-bold">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <Phone size={18} className="text-gray-400" />
                                </div>
                                {addr.phone}
                            </div>
                        </div>

                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            <button
                                onClick={() => addr.id && handleDeleteAddress(addr.id)}
                                className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                title="Remove Address"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Addresses;
