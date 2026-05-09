import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, LogOut, User, CreditCard, Settings } from "lucide-react";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";

const ProfileLayout: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const getUserName = () => {
    const firstName = localStorage.getItem("firstName");
    if (firstName) return firstName;

    const fullName = localStorage.getItem("name");
    if (fullName) return fullName.split(" ")[0];

    const email = localStorage.getItem("email") || localStorage.getItem("userEmail");
    if (email) return email.split("@")[0];

    return "User";
  };

  const userName = getUserName();

  // Redirect if not logged in or if Admin tries to access user profile
  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard");
    }
  }, [token, role, navigate]);


  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
            <aside className="w-full md:w-72 shrink-0 space-y-6">
              {/* User Profile Card - More Professional */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-4">
                  <div className="h-14 w-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                    <User size={28} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Welcome back,</p>
                    <h3 className="font-black text-gray-900 leading-tight truncate">
                      {userName}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Sidebar Sections */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <nav className="p-3">
                  {/* Purchases Section */}
                  <div className="mb-4">
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Purchases</p>
                    <NavLink
                      to="/profile/orders"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                          ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <ShoppingBag size={18} />
                      My Orders
                    </NavLink>
                  </div>

                  {/* Payment Methods Section */}
                  <div className="mb-4">
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment Methods</p>
                    <NavLink
                      to="/profile/payments"
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                          ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <CreditCard size={18} />
                      Cards & Accounts
                    </NavLink>
                  </div>

                  {/* Account Settings Section */}
                  <div className="mb-4">
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Account Settings</p>
                    <div className="space-y-1">
                      <NavLink
                        to="/profile/addresses"
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                            ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }`
                        }
                      >
                        <MapPin size={18} />
                        Saved Addresses
                      </NavLink>
                      <NavLink
                        to="/profile/settings"
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                            ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }`
                        }
                      >
                        <Settings size={18} />
                        Account Details
                      </NavLink>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-2 border-t border-gray-100">
                    <NavLink
                      to="/profile/logout"
                      className={() =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-red-500 hover:bg-red-50`
                      }
                    >
                      <LogOut size={18} />
                      Logout
                    </NavLink>
                  </div>
                </nav>
              </div>

              {role === "ADMIN" && (
                <div className="p-4 bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 px-2">Management</p>
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full py-3 bg-white text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-sm"
                  >
                    Admin Dashboard
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
