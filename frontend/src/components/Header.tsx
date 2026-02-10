import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Search, Phone, User, ShoppingCart } from "lucide-react";
import { cartService } from "../services/cart.service";

const Header = () => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetchCartCount();
    }

    // Listen for cart updates (simple custom event)
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const getUserName = () => {
    const firstName = localStorage.getItem("firstName");
    if (firstName) return firstName;

    const fullName = localStorage.getItem("name");
    if (fullName) return fullName.split(" ")[0];

    const email =
      localStorage.getItem("email") || localStorage.getItem("userEmail");
    if (email) return email.split("@")[0];

    return "";
  };

  const userName = getUserName();

  const fetchCartCount = async () => {
    try {
      const count = await cartService.getCount();
      setCartCount(count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const focusSearch = () => {
    searchRef.current?.focus();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <header className="flex items-center gap-10 bg-white px-[100px] py-[38px] border-b border-gray-200">
      {/* Logo */}
      <Link to="/" className="cursor-pointer">
        <h1 className="text-[30px] font-bold">PrintifyX</h1>
      </Link>

      {/* Search */}
      <div className="relative flex flex-1 justify-center">
        <input
          ref={searchRef}
          placeholder="Product and something awesome..."
          className="w-1/2 rounded-lg border border-gray-300 px-5 py-3 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        <span
          onClick={focusSearch}
          className="absolute right-[29%] top-1/2 -translate-y-1/2 cursor-pointer opacity-60 flex items-center justify-center"
        >
          <Search size={20} />
        </span>
      </div>

      {/* Header actions */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors">
          <Phone size={20} />
          <span>+91 994 879 1267</span>
        </div>

        {isLoggedIn ? (
          <div
            className="relative pb-2"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <div className="flex items-center gap-2 text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors">
              {userName && (
                <span className="text-sm font-medium">{userName}</span>
              )}
              <User size={20} />
            </div>

            {showMenu && (
              <div className="absolute left-0 top-full w-48 rounded-lg bg-white py-4 shadow-2xl ring-1 ring-black ring-opacity-5 z-[200]">
                <button
                  className="block w-full px-6 py-2 text-left text-[16px] text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>
                <div className="px-6 mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-gray-900 py-3 text-[16px] font-bold text-white transition-all hover:bg-black active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors"
          >
            <User size={20} />
            <span>Login</span>
          </Link>
        )}

        <div
          onClick={() => navigate(isLoggedIn ? "/cart" : "/login")}
          className="flex items-center gap-2 text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors relative"
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {isLoggedIn && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
