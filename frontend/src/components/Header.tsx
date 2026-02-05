import { Link } from "react-router-dom";
import { useRef } from "react";

const Header = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  const focusSearch = () => {
    searchRef.current?.focus();
  };

  return (
    <header className="header">
      <h1 className="logo">PrintifyX</h1>

      <div className="search-box">
        <input ref={searchRef} placeholder="Product and something awesome..." />
        <span className="search-icon" onClick={focusSearch}>
          🔍
        </span>
      </div>

      <div className="header-actions">
        <span>📞 214 432 0563</span>
        <Link to="/login" className="login-link">
          👤 Login
        </Link>
        <span>🛒 Cart</span>
      </div>
    </header>
  );
};

export default Header;
