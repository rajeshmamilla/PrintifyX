import { useNavigate } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AdminNotifications from "./AdminNotifications";

const AdminHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-md px-8">
            <div className="flex items-center gap-6">
                <SidebarTrigger className="shrink-0 -ml-4 text-zinc-400 hover:text-zinc-900 transition-colors" />
                
                {/* Modern Search bar */}
                <div className="relative w-72 md:w-[400px] group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search system nexus..."
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-2.5 pl-12 pr-4 text-[13px] font-semibold text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <AdminNotifications />

                {/* Separator */}
                <div className="h-8 w-[1px] bg-zinc-100 mx-2"></div>

                {/* Back to Site */}
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors cursor-pointer"
                >
                    View Storefront
                </button>

                {/* Logout Button - Premium */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-black transition-all shadow-lg shadow-zinc-900/10 active:scale-95 group cursor-pointer"
                >
                    <LogOut size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                    <span>System Logout</span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
