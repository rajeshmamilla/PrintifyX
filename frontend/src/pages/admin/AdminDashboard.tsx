import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Package, ShoppingBag, Clock, Loader2, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({
        totalCategories: 0,
        activeProducts: 0,
        totalOrders: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [recentCategories, setRecentCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            };
            const [categoriesRes, productsRes, ordersRes] = await Promise.all([
                fetch("http://localhost:8081/api/admin/categories", { headers }),
                fetch("http://localhost:8081/api/admin/products", { headers }),
                fetch("http://localhost:8081/api/orders", { headers })
            ]);

            const categories = await categoriesRes.json();
            const products = await productsRes.json();
            const orders = await ordersRes.json();

            setMetrics({
                totalCategories: categories.length,
                activeProducts: products.filter((p: any) => p.isActive).length,
                totalOrders: orders.length,
                pendingOrders: orders.filter((o: any) => o.status === "CREATED" || o.status === "PENDING").length
            });

            // Sort and slice data
            setRecentOrders(orders.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ).slice(0, 5));

            setRecentProducts(products.sort((a: any, b: any) =>
                b.id - a.id // Assuming ID is incremental for newest
            ).slice(0, 4));

            setRecentCategories(categories.sort((a: any, b: any) =>
                b.id - a.id
            ).slice(0, 4));

        } catch (error) {
            console.error("Error fetching admin dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            setUpdatingId(id);
            const res = await fetch(`http://localhost:8081/api/orders/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const statCards = [
        { name: "Total Categories", value: metrics.totalCategories, icon: Tag, color: "bg-blue-500", path: "/admin/categories" },
        { name: "Active Products", value: metrics.activeProducts, icon: Package, color: "bg-green-500", path: "/admin/products" },
        { name: "Total Orders", value: metrics.totalOrders, icon: ShoppingBag, color: "bg-purple-500", path: "/admin/orders" },
        { name: "Pending Orders", value: metrics.pendingOrders, icon: Clock, color: "bg-orange-500", path: "/admin/orders" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h2>
                    <p className="text-gray-500 mt-1 font-medium">Welcome back, Administrator. Here's what's happening today.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
                >
                    <Clock size={16} />
                    Refresh Data
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <div
                        key={card.name}
                        onClick={() => navigate(card.path)}
                        className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className={`${card.color} h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            <card.icon size={26} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{card.name}</p>
                            <h3 className="text-3xl font-black text-gray-900">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-black text-gray-900">Recent Orders</h3>
                        <button
                            onClick={() => navigate("/admin/orders")}
                            className="text-orange-500 text-sm font-bold hover:underline flex items-center gap-1"
                        >
                            View Full Report <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <th className="px-8 py-4">Order Details</th>
                                    <th className="px-8 py-4">Customer</th>
                                    <th className="px-8 py-4">Total</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                                            {order.customerEmail}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-gray-900">
                                            ₹{order.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === "SHIPPED" ? "bg-green-100 text-green-700" :
                                                order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                                    order.status === "PAID" ? "bg-blue-100 text-blue-700" :
                                                        "bg-orange-100 text-orange-700"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-center">
                                                <select
                                                    disabled={updatingId === order.id}
                                                    className="bg-gray-100 border-none rounded-lg px-2 py-1 text-[10px] font-black focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                >
                                                    <option value="CREATED">CREATED</option>
                                                    <option value="PAID">PAID</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                                {updatingId === order.id && <Loader2 className="animate-spin ml-2 text-orange-500" size={14} />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Catalog Highlights */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center justify-between">
                            Newest Products
                            <button
                                onClick={() => navigate("/admin/products")}
                                className="text-xs font-bold text-orange-500 hover:underline"
                            >
                                All Products
                            </button>
                        </h3>
                        <div className="space-y-4">
                            {recentProducts.map(p => (
                                <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                    <div className="h-10 w-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center font-black">
                                        {p.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{p.category?.name}</p>
                                    </div>
                                    <div className="text-sm font-black text-gray-900 italic">
                                        ₹{p.basePrice}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center justify-between">
                            Recent Categories
                            <button
                                onClick={() => navigate("/admin/categories")}
                                className="text-xs font-bold text-orange-500 hover:underline"
                            >
                                All Categories
                            </button>
                        </h3>
                        <div className="space-y-4">
                            {recentCategories.map(c => (
                                <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-black">
                                        {c.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{c.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">/{c.slug}</p>
                                    </div>
                                    <div className={`h-2 w-2 rounded-full ${c.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
