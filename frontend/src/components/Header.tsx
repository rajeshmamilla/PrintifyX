import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { cartService } from "../services/cart.service";
import { Search, Phone, User, ShoppingCart, X, Menu, LayoutDashboard, LogOut } from "lucide-react";
import Logo from "../assets/logo.png";
import { toast } from "sonner";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<typeof PRODUCTS>([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navCategories, setNavCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/categories/with-products`);
        if (response.ok) {
          const data = await response.json();
          setNavCategories(data);
        }
      } catch (error) {
        console.error("Error fetching navbar categories:", error);
      }
    };
    fetchNavData();
  }, []);

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
    localStorage.removeItem("name");
    localStorage.removeItem("picture");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <header className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-10 bg-white px-4 md:px-[100px] py-2 md:py-3 border-b border-gray-200 sticky top-0 z-[500]">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Logo */}
      <Link to="/" className="cursor-pointer shrink-0">
        <img src={Logo} alt="PrintifyX Logo" className="h-18 md:h-28 w-auto object-contain" />
      </Link>

      {/* Search */}
      <div className="relative flex order-3 md:order-2 w-full md:flex-1 justify-center" ref={searchRef}>
        <div className="relative w-full md:w-3/5 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search
              size={18}
              className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors duration-300"
            />
          </div>
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (filteredProducts.length > 0) setShowResults(true); }}
            placeholder="Search for custom products..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-12 py-3 text-[14px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all duration-300 outline-none shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-all group/btn active:scale-90"
              >
                <X
                  size={14}
                  className="text-zinc-500 group-hover/btn:text-zinc-900 transition-colors"
                />
              </button>
            )}
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
                        toast.info("This category is currently under development. Please explore our BUSINESS CARDS selection in the meantime!");
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
      <div className="flex items-center gap-4 md:gap-8 order-2 md:order-3 ml-auto md:ml-0">
        <div className="flex items-center gap-2 text-sm md:text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors">
          <Phone size={20} />
          <span className="hidden lg:inline">+91 994 XXX XXXX</span>
        </div>

        {isLoggedIn ? (
          <div
            className="relative"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <div className="flex items-center gap-2 text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors py-2">
              {userName && (
                <span className="text-sm font-semibold text-zinc-600">{userName}</span>
              )}
              {localStorage.getItem("picture") ? (
                <img
                  src={localStorage.getItem("picture") || ""}
                  alt={userName}
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <User size={18} />
                </div>
              )}
            </div>

            {showMenu && (
              <div className="absolute right-0 top-full w-56 rounded-2xl bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-100 z-[200] animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-0.5">
                  {isAdmin ? (
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2 text-left text-[14px] font-medium text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all group"
                      onClick={() => {
                        setShowMenu(false);
                        navigate("/admin/dashboard");
                      }}
                    >
                      <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors border border-zinc-100/50">
                        <LayoutDashboard size={16} className="text-zinc-500" />
                      </div>
                      Admin Dashboard
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-3 w-full px-3 py-2 text-left text-[14px] font-medium text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all group"
                      onClick={() => {
                        setShowMenu(false);
                        navigate("/profile");
                      }}
                    >
                      <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors border border-zinc-100/50">
                        <User size={16} className="text-zinc-500" />
                      </div>
                      My Profile
                    </button>
                  )}

                  <div className="h-px bg-zinc-50 my-1.5 mx-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left text-[14px] font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors border border-red-100/20">
                      <LogOut size={16} className="text-red-500" />
                    </div>
                    Logout Account
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
            className="flex items-center gap-2 text-sm md:text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {isLoggedIn && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="p-6">
            <ul className="space-y-4">
              {navCategories.length > 0 ? (
                navCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/categories/${category.slug}`}
                      className="block text-lg font-bold text-gray-900 hover:text-orange-500 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.products && category.products.length > 0 && (
                      <ul className="mt-2 ml-4 space-y-2 border-l-2 border-gray-50 pl-4">
                        {category.products.slice(0, 3).map((product: any) => (
                          <li key={product.id}>
                            <Link
                              to={`/products/${product.slug}`}
                              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {product.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))
              ) : (
                ["Business Cards", "Flyers", "Banners", "Posters", "Stickers"].map((cat) => (
                  <li key={cat}>
                    <span className="block text-lg font-bold text-gray-400 cursor-not-allowed">
                      {cat}
                    </span>
                  </li>
                ))
              )}
            </ul>

            <div className="mt-10 pt-10 border-t border-gray-100 space-y-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={20} className="text-orange-500" />
                <span className="font-bold text-sm">+91 994 879 1267</span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
