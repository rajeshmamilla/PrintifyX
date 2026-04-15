import { useState, useEffect } from 'react';
import { Bell, Loader2, X } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";
import { fetchWithAuth } from "../../services/apiClient";

const AdminNotifications = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
    // Store reading state as a record: { [orderId]: "STATUS" }
    const [readStates, setReadStates] = useState<Record<string, string>>(() => {
        const stored = localStorage.getItem('admin_read_notifications');
        return stored ? JSON.parse(stored) : {};
    });

    const fetchLatestOrders = async () => {
        try {
            setLoading(true);
            const res = await fetchWithAuth('/orders');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Sort descending by creation date
                    const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setOrders(sorted);
                }
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchLatestOrders();
        // Poll every 60 seconds
        const interval = setInterval(fetchLatestOrders, 60000);
        return () => clearInterval(interval);
    }, []);

    // Filter to only show unread notifications
    // A notification is unread if its current status is different from what we recorded
    const unreadNotifications = orders.filter(o => readStates[o.id] !== o.status);
    
    const unreadCount = unreadNotifications.length;

    const handleDismiss = (orderId: number, status: string) => {
        const updated = { ...readStates, [orderId]: status };
        setReadStates(updated);
        localStorage.setItem('admin_read_notifications', JSON.stringify(updated));
    };

    return (
        <Sheet open={open} onOpenChange={(val) => { setOpen(val); if (val) fetchLatestOrders(); }}>
            <SheetTrigger render={<button className="relative text-gray-500 hover:text-orange-500 transition-colors" />}>
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full z-[2000]">
                <SheetHeader className="mb-4 shrink-0">
                    <div className="flex items-center justify-between mt-6 sm:mt-0">
                        <SheetTitle>Hello Admin!</SheetTitle>
                    </div>
                    <SheetDescription>
                        Here is your latest updates
                    </SheetDescription>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto pr-2 pb-4 flex flex-col gap-3 space-y-1">
                    {loading && orders.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-orange-500" size={24} />
                        </div>
                    ) : unreadCount === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                            <Bell className="text-gray-200 mb-3" size={32} />
                            <p className="text-sm font-semibold text-gray-900">You're all caught up!</p>
                            <p className="text-xs text-gray-500 mt-1">No new notifications to display.</p>
                        </div>
                    ) : (
                        unreadNotifications.map((order, index) => {
                            const isCancelled = order.status === 'CANCELLED';
                            const actionText = isCancelled ? 'cancelled' : order.status === 'DELIVERED' ? 'received' : 'placed';
                            return (
                                <div 
                                    key={`${order.id}-${order.status}`} 
                                    className="relative p-4 bg-gray-50 border border-gray-100 rounded-lg flex flex-col gap-2 transition-all hover:bg-gray-100 hover:shadow-sm animate-in fade-in slide-in-from-right-12"
                                    style={{ animationDuration: '500ms', animationFillMode: 'both', animationDelay: `${index * 120}ms` }}
                                >
                                    <button 
                                        onClick={() => handleDismiss(order.id, order.status)}
                                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 transition-colors bg-white hover:bg-gray-200 shadow-sm rounded-full p-1 border border-gray-200"
                                        title="Mark as read"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex justify-between items-start gap-6 pr-6">
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-900">{order.customerEmail || 'Guest'}</span> {actionText} an order of <span className="font-semibold text-gray-900">₹{Number(order.totalAmount).toLocaleString()}</span>.
                                            <div className="text-xs text-gray-500 mt-1.5 font-medium">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AdminNotifications;
