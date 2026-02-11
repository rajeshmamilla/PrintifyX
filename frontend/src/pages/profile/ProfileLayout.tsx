import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, LogOut, User } from "lucide-react";
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

  // Redirect if not logged in
  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const menuItems = [
    { name: "My Orders", path: "/profile/orders", icon: ShoppingBag },
    { name: "Saved Addresses", path: "/profile/addresses", icon: MapPin },
    { name: "Logout", path: "/profile/logout", icon: LogOut },
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
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-8 bg-gray-50 border-b border-gray-100 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                  <User size={32} />
                </div>
                <h3 className="font-bold text-gray-900 leading-tight">
                  {userName}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Welcome
                </p>
              </div>

              <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-semibold text-sm ${isActive
                        ? "bg-gray-100 text-gray-900"
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

            {role === "ADMIN" && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Admin Access
                </p>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="w-full py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Admin Panel
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
