import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { fetchWithAuth } from "../../services/apiClient";

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const userId = localStorage.getItem("userId");
  const isUserValid = userId && userId !== "undefined" && userId !== "null";

  useEffect(() => {
    if (isUserValid) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("User session not found. Please log in again.");
    }
  }, [isUserValid]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth(`/orders/user/${userId}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Error ${res.status}: ${errorText || "Failed to fetch orders"}`,
        );
      }

      const data = await res.json();
      setOrders(
        Array.isArray(data)
          ? data.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime(),
          )
          : [],
      );
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SHIPPED":
        return <CheckCircle2 size={14} className="text-green-500" />;
      case "CANCELLED":
        return <XCircle size={14} className="text-red-500" />;
      case "PAID":
        return <Clock size={14} className="text-blue-500" />;
      default:
        return <AlertCircle size={14} className="text-orange-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-700">
        <div className="relative">
          <Loader2 className="animate-spin text-zinc-900 mb-6" size={56} strokeWidth={1.5} />
          <div className="absolute inset-0 blur-xl bg-zinc-400/20 animate-pulse"></div>
        </div>
        <p className="font-black text-zinc-400 uppercase tracking-[0.2em] text-xs">
          Retrieving History
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">
            Order History
          </h1>
          <p className="text-sm text-zinc-500 font-bold italic">Track and manage your recent purchases</p>
        </div>
        <div className="px-6 py-3 bg-white rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
              Total Orders
            </p>
            <p className="text-2xl font-black text-zinc-900 leading-none">
              {orders.length}
            </p>
          </div>
          <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500 shadow-xl shadow-red-100/20">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-red-100 shrink-0">
              <AlertCircle size={28} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-red-900 tracking-tight uppercase">Session Missing</h3>
              <p className="text-sm text-red-700/70 font-bold leading-relaxed mt-1">Please sign in again to view your personalized order history.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full md:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-xl shadow-red-200 cursor-pointer active:scale-95"
          >
            Authenticate
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 flex flex-col items-center text-center border border-zinc-200 shadow-sm">
          <div className="h-24 w-24 bg-zinc-50 rounded-3xl flex items-center justify-center text-zinc-200 mb-8 shadow-inner">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">
            No orders found
          </h3>
          <p className="text-zinc-500 font-bold max-w-sm mb-10 text-base leading-relaxed">
            Your history is empty. Start exploring our premium product catalog to place your first order!
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-zinc-200 cursor-pointer active:scale-95"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 group overflow-hidden relative"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-zinc-50 rounded-[1.25rem] flex items-center justify-center text-zinc-400 font-black text-lg shrink-0 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 shadow-inner">
                    #{orders.length - index}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg font-black text-zinc-900 tracking-tight">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-zinc-400 font-black uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full"></div>
                      <p className="text-xs text-zinc-400 font-black uppercase tracking-widest">
                        {order.itemsCount || 1} Products
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Amount</span>
                    <p className="text-2xl font-black text-zinc-900 tracking-tighter">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase shadow-sm ${
                      order.status === "SHIPPED" || order.status === "DELIVERED"
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : order.status === "CANCELLED"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : order.status === "PAID" || order.status === "PROCESSING"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-zinc-50 text-zinc-500 border border-zinc-100"
                      }`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/profile/orders/${order.id}`)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-zinc-200 cursor-pointer active:scale-95 group/btn"
                  >
                    Manage
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Decorative background number */}
              <div className="absolute -right-6 -bottom-10 text-[10rem] font-black text-zinc-50/50 pointer-events-none group-hover:text-zinc-100 transition-all duration-700 italic select-none">
                {orders.length - index}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
