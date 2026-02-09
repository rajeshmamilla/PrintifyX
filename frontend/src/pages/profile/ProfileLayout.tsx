import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, LogOut, User } from 'lucide-react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';

const ProfileLayout: React.FC = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    // Redirect if not logged in
    React.useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const menuItems = [
        { name: 'My Orders', path: '/profile/orders', icon: ShoppingBag },
        { name: 'Saved Addresses', path: '/profile/addresses', icon: MapPin },
        { name: 'Logout', path: '/profile/logout', icon: LogOut },
    ];

    if (!token) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 bg-orange-50 border-b border-orange-100 flex flex-col items-center text-center">
                                <div className="h-16 w-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-100">
                                    <User size={32} />
                                </div>
                                <h3 className="font-black text-gray-900 leading-tight">User Dashboard</h3>
                                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest mt-1">Status: Active</p>
                            </div>

                            <nav className="p-4 space-y-1">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                                                ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            }`
                                        }
                                    >
                                        <item.icon size={18} />
                                        {item.name}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>

                        {role === 'ADMIN' && (
                            <div className="mt-4 p-4 bg-gray-900 rounded-2xl text-white">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Detected</p>
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="w-full py-2 bg-orange-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-colors"
                                >
                                    Go to Admin Panel
                                </button>
                            </div>
                        )}
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
