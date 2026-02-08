import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BusinessCardsCategory from "./pages/BusinessCardsCategory";
import ProductCustomizerPage from "./pages/ProductCustomizerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories/business-cards" element={<BusinessCardsCategory />} />
        <Route path="/products/:productId" element={<ProductCustomizerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
