import React, { useState, useEffect } from 'react';
import { X, Loader2, Package } from 'lucide-react';
import OrderItemsTable from './OrderItemsTable';
import { fetchWithAuth } from "../../../services/apiClient";

interface OrderDetailsModalProps {
    orderId: number;
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ orderId, onClose }) => {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [productLoading, setProductLoading] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await fetchWithAuth(`/orders/${orderId}`);
            if (!res.ok) throw new Error('Failed to fetch order details');
            const data = await res.json();

            // For each item, fetch product details to get image
            const fullItems = await Promise.all(
                (data.items || []).map(async (item: any) => {
                    const prodRes = await fetchWithAuth(`/products/${item.productId}`);
                    const prodData = await prodRes.json();
                    return { ...item, product: prodData };
                })
            );

            setOrder({ ...data, items: fullItems });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetails = async (productId: number) => {
        try {
            setProductLoading(true);
            const res = await fetchWithAuth(`/products/${productId}`);
            if (!res.ok) throw new Error('Failed to fetch product details');
            const data = await res.json();
            setSelectedProduct(data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setProductLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-12 flex flex-col items-center">
                    <Loader2 className="animate-spin text-gray-900 mb-4" size={48} />
                    <p className="font-bold text-gray-600">Loading Order Details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 max-w-sm w-full">
                    <p className="text-red-500 font-bold mb-4">Error: {error || 'Order not found'}</p>
                    <button onClick={onClose} className="w-full bg-gray-100 py-3 rounded-lg font-bold">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 animate-in fade-in duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">Order {order.orderNumber}</h2>
                        <p className="text-sm text-gray-500 font-medium">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Customer Information</h3>
                            <p className="font-bold text-gray-900">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.customerEmail}</p>
                            <p className="text-sm text-gray-600">{order.customerPhone}</p>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order Summary</h3>
                            <p className="text-sm text-gray-600 font-medium">Status: <span className="font-black text-gray-900">{order.status}</span></p>
                            <p className="text-lg font-black text-gray-900 mt-1">Total: ₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <h3 className="text-lg font-black text-gray-900 mb-4">Order Items</h3>
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                            <OrderItemsTable items={order.items || []} />
                        </div>
                    </div>

                    {/* Optional Product Detail View */}
                    <div className="grid grid-cols-1 gap-4">
                        <h3 className="text-lg font-black text-gray-900">Inspect Products</h3>
                        <div className="flex flex-wrap gap-2">
                            {(order.items || []).map((item: any) => (
                                <button
                                    key={item.id}
                                    onClick={() => fetchProductDetails(item.productId)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-all ${selectedProduct?.id === item.productId
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"
                                        }`}
                                >
                                    <Package size={16} />
                                    {item.productName}
                                </button>
                            ))}
                        </div>

                        {productLoading && (
                            <div className="flex items-center gap-2 text-orange-500 animate-pulse py-4">
                                <Loader2 className="animate-spin" size={20} />
                                <span className="text-sm font-bold uppercase tracking-wider">Fetching Product Data...</span>
                            </div>
                        )}

                        {selectedProduct && !productLoading && (
                            <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-100 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xl font-black text-gray-900">{selectedProduct.name}</h4>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedProduct.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                        {selectedProduct.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Description</p>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">{selectedProduct.description}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                                            <p className="text-sm font-bold text-gray-800">{selectedProduct.category?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Base Price</p>
                                            <p className="text-xl font-black text-orange-600">₹{selectedProduct.basePrice?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-100 flex justify-end bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-lg font-black text-sm hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
