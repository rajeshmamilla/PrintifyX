import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BusinessCardsCategory from "./pages/BusinessCardsCategory";
import ProductCustomizerPage from "./pages/ProductCustomizerPage";
import CartPage from "./pages/CartPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import ProfileLayout from "./pages/profile/ProfileLayout";
import Orders from "./pages/profile/Orders";
import OrderDetails from "./pages/profile/OrderDetails";
import Addresses from "./pages/profile/Addresses";
import Logout from "./pages/profile/Logout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories/business-cards" element={<BusinessCardsCategory />} />
        <Route path="/products/:productId" element={<ProductCustomizerPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* User Profile Routes */}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="/profile/orders" replace />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
