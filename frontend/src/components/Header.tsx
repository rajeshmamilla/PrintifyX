import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { cartService } from "../services/cart.service";
import { Search, Phone, User, ShoppingCart, X } from "lucide-react";

// Hardcoded product list for frontend-only search
const PRODUCTS = [
  // Business (Implemented)
  { id: 1, name: "Standard Business Cards", slug: "standard-business-cards", category: "Business Cards", implemented: true },
  { id: 2, name: "Plastic Business Cards", slug: "plastic-business-cards", category: "Business Cards", implemented: true },

  // Postcards
  { id: 3, name: "Standard Postcards", category: "Postcards", implemented: false },
  { id: 4, name: "EDDM Postcards", category: "Postcards", implemented: false },

  // Flyers & Brochures
  { id: 5, name: "Business Flyers", category: "Flyers & Brochures", implemented: false },
  { id: 6, name: "Club Flyers", category: "Flyers & Brochures", implemented: false },

  // Flyers Category
  { id: 7, name: "Standard Flyers", category: "Flyers", implemented: false },
  { id: 8, name: "Premium Flyers", category: "Flyers", implemented: false },

  // Brochures
  { id: 9, name: "Bi-Fold Brochures", category: "Brochures", implemented: false },
  { id: 10, name: "Tri-Fold Brochures", category: "Brochures", implemented: false },
  { id: 11, name: "Z-Fold Brochures", category: "Brochures", implemented: false },

  // Menus
  { id: 12, name: "Restaurant Menus", category: "Menus", implemented: false },
  { id: 13, name: "Takeout Menus", category: "Menus", implemented: false },

  // Banners
  { id: 14, name: "Vinyl Banners", category: "Banners", implemented: false },
  { id: 15, name: "Mesh Banners", category: "Banners", implemented: false },
  { id: 16, name: "Fabric Banners", category: "Banners", implemented: false },

  // Displays
  { id: 17, name: "Roll-Up Banners", category: "Displays", implemented: false },
  { id: 18, name: "X-Stand Displays", category: "Displays", implemented: false },

  // Outdoor
  { id: 19, name: "Fence Banners", category: "Outdoor", implemented: false },
  { id: 20, name: "Pole Banners", category: "Outdoor", implemented: false },

  // Posters
  { id: 21, name: "Paper Posters", category: "Posters", implemented: false },
  { id: 22, name: "Photo Posters", category: "Posters", implemented: false },

  // Large Format
  { id: 23, name: "Foam Board", category: "Large Format", implemented: false },
  { id: 24, name: "Mounted Posters", category: "Large Format", implemented: false },

  // Events
  { id: 25, name: "Movie Posters", category: "Events", implemented: false },
  { id: 26, name: "Event Posters", category: "Events", implemented: false },

  // Stickers
  { id: 27, name: "Die-Cut Stickers", category: "Stickers", implemented: false },
  { id: 28, name: "Kiss-Cut Stickers", category: "Stickers", implemented: false },

  // Labels
  { id: 29, name: "Product Labels", category: "Labels", implemented: false },
  { id: 30, name: "Bottle Labels", category: "Labels", implemented: false },

  // Decals
  { id: 31, name: "Window Decals", category: "Decals", implemented: false },
  { id: 32, name: "Wall Decals", category: "Decals", implemented: false },
];

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const renderHighlightedText = (text: string, highlight: string) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${escapeRegExp(highlight.trim())})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.trim().toLowerCase() ? (
          <span key={i} className="bg-yellow-200 text-gray-900 rounded-sm font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<typeof PRODUCTS>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Handle clicking outside to close search results
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateHeaderState = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const isTokenValid = token && token !== "undefined" && token !== "null";
      setIsLoggedIn(!!isTokenValid);
      setIsAdmin(role === "ADMIN");

      if (isTokenValid && role !== "ADMIN") {
        fetchCartCount();
      }
    };

    updateHeaderState();

    // Listen for cart updates (simple custom event)
    const handleCartUpdate = () => {
      updateHeaderState();
    };

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

  const handleSearch = (currentQuery: string) => {
    const query = currentQuery.trim().toLowerCase();
    if (query.length < 3) {
      setFilteredProducts([]);
      setShowResults(false);
      return;
    }

    const filtered = PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setShowResults(true);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts([]);
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setIsAdmin(false);
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
      <div className="relative flex flex-1 justify-center group" ref={searchRef}>
        <div className="relative w-1/2">
          <input
            value={searchQuery}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (filteredProducts.length > 0) setShowResults(true); }}
            placeholder="Product and something awesome..."
            className="w-full rounded-lg border border-gray-300 px-5 py-3 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-shadow duration-200 focus:shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <X
                size={16}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                onClick={clearSearch}
              />
            )}
            <Search
              size={20}
              className="cursor-pointer opacity-60 hover:opacity-100 transition-all active:scale-95"
              onClick={() => handleSearch(searchQuery)}
            />
          </div>

          {/* Google-style Results Dropdown */}
          <div
            className={`absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-[300] overflow-hidden transition-all duration-300 transform origin-top ${showResults
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
          >
            {filteredProducts.length > 0 ? (
              <div className="py-2">
                <div className="px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 mb-1">
                  Products
                </div>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (product.implemented && product.slug) {
                        navigate(`/products/${product.slug}`);
                        setShowResults(false);
                        setSearchQuery("");
                      } else {
                        alert("This page is yet to develop, Try Business cards");
                      }
                    }}
                    className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="text-[15px] font-semibold text-gray-900 group-hover:text-black">
                        {renderHighlightedText(product.name, searchQuery)}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium lowercase first-letter:uppercase">
                        in {product.category}
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-black transform translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-12 text-center">
                <div className="text-gray-900 font-bold mb-1">No products found</div>
                <div className="text-[13px] text-gray-500 font-medium">Try a different keyword or browse categories</div>
              </div>
            )}
          </div>
        </div>
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
                {isAdmin ? (
                  <button
                    className="block w-full px-6 py-2 text-left text-[16px] text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/admin/dashboard");
                    }}
                  >
                    Admin Dashboard
                  </button>
                ) : (
                  <button
                    className="block w-full px-6 py-2 text-left text-[16px] text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/profile");
                    }}
                  >
                    My Profile
                  </button>
                )}
                <div className="px-6 mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-white border border-gray-200 py-3 text-[16px] font-bold text-gray-900 transition-all hover:bg-gray-50 active:scale-95"
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

        {!isAdmin && (
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
        )}
      </div>
    </header>
  );
};

export default Header;
