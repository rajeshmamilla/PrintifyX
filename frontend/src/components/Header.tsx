import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">PrintifyX</h1>

      <div className="search-box">
        <input placeholder="Product and something awesome..." />
        <span className="search-icon">🔍</span>
      </div>

      <div className="header-actions">
        <span>📞 214 432 0563</span>
        <Link to="/login" className="login-link"> 👤 Login </Link>


        <span>🛒 Cart</span>
      </div>
    </header>
  );
};

export default Header;
