import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Search } from "lucide-react";

const AdminHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <header className="fixed top-0 right-0 left-64 h-20 bg-white border-b border-gray-200 z-10 flex items-center justify-between px-8">
            {/* Search bar inside header */}
            <div className="relative w-96">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                </span>
                <input
                    type="text"
                    placeholder="Search for orders, products..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative text-gray-500 hover:text-orange-500 transition-colors">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                        3
                    </span>
                </button>

                {/* Separator */}
                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                {/* Back to Site / Storefront */}
                <button
                    onClick={() => navigate("/")}
                    className="text-sm font-medium text-gray-600 hover:text-orange-500"
                >
                    View Storefront
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
