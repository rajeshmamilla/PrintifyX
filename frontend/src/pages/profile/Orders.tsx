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
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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

  const handleCancelOrder = async (orderId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone.",
      )
    )
      return;

    try {
      setCancellingId(orderId);
      const res = await fetchWithAuth(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      setNotification({
        message: "Order cancelled successfully",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
      fetchOrders();
    } catch (err: any) {
      setNotification({ message: err.message, type: "error" });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setCancellingId(null);
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
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
        <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">
          Retrieving your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          My Orders
        </h1>
        <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
            Total History
          </p>
          <p className="text-lg font-black text-gray-900 leading-none mt-1">
            {orders.length}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
          <AlertCircle size={24} />
          <div>
            <p className="font-bold tracking-tight">Sync Failure</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      {notification && (
        <div
          className={`fixed top-8 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-8 duration-300 ${notification.type === "success"
            ? "bg-green-50 border-green-100 text-green-800"
            : "bg-red-50 border-red-100 text-red-800"
            }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={24} />
          ) : (
            <AlertCircle size={24} />
          )}
          <p className="font-bold text-sm tracking-tight">
            {notification.message}
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 flex flex-col items-center text-center border border-gray-100">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 font-medium max-w-xs mb-8">
            Check out our latest products and place your first order.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-black text-sm hover:bg-orange-600 transition-all shadow-xl shadow-orange-100"
          >
            Browse Storefront
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xs shrink-0 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                    #{order.id}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 tracking-tight">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-1 text-right">
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest md:hidden text-left">
                    Total Amount
                  </p>
                  <p className="text-lg font-black text-gray-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>

                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase md:justify-self-end w-fit ${order.status === "SHIPPED"
                      ? "bg-green-50 text-green-700"
                      : order.status === "CANCELLED"
                        ? "bg-red-50 text-red-700"
                        : order.status === "PAID"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <button
                    onClick={() => navigate(`/profile/orders/${order.id}`)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-transparent hover:border-gray-100"
                  >
                    Details
                    <ChevronRight size={14} />
                  </button>

                  {(order.status === "CREATED" ||
                    order.status === "PENDING") && (
                      <button
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex items-center justify-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        title="Cancel Order"
                      >
                        {cancellingId === order.id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                      </button>
                    )}
                </div>
              </div>

              {/* Decorative background number */}
              <div className="absolute -right-4 -bottom-8 text-9xl font-black text-gray-50/50 pointer-events-none group-hover:text-orange-50/30 transition-colors italic">
                {order.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
