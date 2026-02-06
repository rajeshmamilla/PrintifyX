import { Link } from "react-router-dom";
import { useRef } from "react";
import { Search, Phone, User, ShoppingCart } from "lucide-react";

const Header = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  const focusSearch = () => {
    searchRef.current?.focus();
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
          className="w-1/2 rounded-[20px] border border-gray-300 px-5 py-3 pr-12 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
          <span>214 432 0563</span>
        </div>

        <Link
          to="/login"
          className="flex items-center gap-2 text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors"
        >
          <User size={20} />
          <span>Login</span>
        </Link>

        <div className="flex items-center gap-2 text-[16px] font-medium text-gray-700 cursor-pointer hover:text-orange-500 transition-colors">
          <ShoppingCart size={20} />
          <span>Cart</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
