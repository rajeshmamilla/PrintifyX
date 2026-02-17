import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { cartService } from "../services/cart.service";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await cartService.updateQuantity(itemId, newQuantity);
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartService.removeItem(itemId);
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    navigate("/payment");
  };

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce(
      (acc: number, item: any) => acc + item.totalPrice,
      0,
    );
  };

  if (loading)
    return (
      <div className="min-h-screen">
        <Header />
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20">
          Loading cart...
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-grow max-w-[1200px] mx-auto px-6 py-12 w-full">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Your Shopping Cart
          </h1>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Explore our products and add something awesome!
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Table */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Product
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Price
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Total
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item: any) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 mb-1">
                              {item.productName}
                            </span>
                            <div className="text-xs text-gray-500 space-y-1">
                              {Object.entries(item.customization || {}).map(
                                ([key, val]: any) => (
                                  <div key={key}>
                                    <span className="font-medium">{key}:</span>{" "}
                                    {val}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-gray-700 font-medium">
                          ₹{item.unitPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3 bg-gray-100 w-fit rounded-lg px-2 py-1">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 hover:text-blue-600 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-bold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:text-blue-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-blue-600 font-bold">
                          ₹{item.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ₹{calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white h-14 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  Place Order
                </button>
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure SSL Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
