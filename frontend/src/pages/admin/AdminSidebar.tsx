import { NavLink } from "react-router-dom";
import { LayoutDashboard, Tag, Package, ShoppingBag } from "lucide-react";

const AdminSidebar = () => {
    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Categories", path: "/admin/categories", icon: Tag },
        { name: "Products", path: "/admin/products", icon: Package },
        { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white transition-all">
            <div className="flex flex-col h-full">
                {/* Brand */}
                <div className="flex items-center gap-2 px-6 py-10">
                    <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-xl">P</div>
                    <span className="text-xl font-bold tracking-tight">PrintifyX Admin</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-semibold">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Info / Footer */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
                        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">A</div>
                        <div>
                            <p className="text-white font-medium">Administrator</p>
                            <p className="text-xs">Level: Super Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
