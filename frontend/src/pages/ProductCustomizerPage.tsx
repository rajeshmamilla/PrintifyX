import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductOptionSelect from "../components/ProductOptionSelect";
import PriceSummary from "../components/PriceSummary";
import { cartService } from "../services/cart.service";

// Import images
import plasticBusinessCardsImg from "../assets/products/plastic business cards.png";
import standardBusinessCardsImg from "../assets/products/standard business cards.png";

// Mock Data Store
const PRODUCT_DATA: Record<string, any> = {
    "plastic-business-cards": {
        title: "Plastic Business Cards",
        category: "Business Cards",
        image: plasticBusinessCardsImg,
        options: {
            Size: ["2 x 3.5 (U.S. Standard)", "3.35 x 2.17 (European Standard)"],
            Quantity: ["100", "250", "500", "1000"],
            "Select Shape": ["Rectangle", "Rounded Corners"],
            Material: ["20 pt. White Plastic", "20 pt. Clear Plastic", "20 pt. Frosted Plastic"],
            "Printing Sides": ["Single Sided", "Double Sided"],
        },
        basePrice: 1200, // Example base price in INR
    },
    "standard-business-cards": {
        title: "Standard Business Cards",
        category: "Business Cards",
        image: standardBusinessCardsImg,
        options: {
            Size: ["2 x 3.5 (U.S. Standard)"],
            Quantity: ["100", "250", "500", "1000", "2500"],
            "Select Shape": ["Rectangle"],
            Material: ["14 pt. Gloss Coated Cover", "16 pt. Premium Matte"],
            "Printing Sides": ["Single Sided", "Double Sided"],
        },
        basePrice: 450,
    },
};

const ProductCustomizerPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();
    const product = productId ? PRODUCT_DATA[productId] : null;

    // State for selections
    const [selections, setSelections] = useState<Record<string, string>>(() => {
        if (!product) return {};
        const initial: Record<string, string> = {};
        Object.keys(product.options).forEach((key) => {
            initial[key] = product.options[key][0];
        });
        return initial;
    });

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                        <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const handleOptionChange = (key: string, value: string) => {
        setSelections((prev) => ({ ...prev, [key]: value }));
    };

    const calculatePrice = () => {
        // Simple mock calculation logic
        let total = product.basePrice;
        if (selections["Quantity"]) {
            total *= parseInt(selections["Quantity"]) / 100;
        }
        if (selections["Printing Sides"] === "Double Sided") {
            total += 200;
        }
        return total;
    };

    const handleAddToCart = async (showAlert = true) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const quantity = parseInt(selections["Quantity"] || "100");
            const totalPrice = calculatePrice();
            const unitPrice = totalPrice / quantity;

            await cartService.addItem({
                productId: productId === "plastic-business-cards" ? 1 : 2, // Mock IDs
                productName: product.title,
                unitPrice: unitPrice,
                quantity: quantity,
                totalPrice: totalPrice,
                customization: selections
            });

            // Dispatch event to update header
            window.dispatchEvent(new Event("cartUpdated"));
            if (showAlert) alert("Added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart(false);
        navigate("/payment");
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6 py-6">
                {/* Breadcrumb */}
                <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
                    <ol className="flex list-none p-0">
                        <li className="flex items-center">
                            <Link to="/" className="hover:text-blue-600 text-blue-600">Home</Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="flex items-center">
                            <Link to="/categories/business-cards" className="hover:text-blue-600 text-blue-600">Business Cards</Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="text-gray-900 font-medium">{product.title}</li>
                    </ol>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Image Gallery */}
                    <div className="w-full lg:w-1/2">
                        <ProductImageGallery image={product.image} alt={product.title} />
                    </div>

                    {/* Right: Configurator */}
                    <div className="w-full lg:w-1/2">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 inline-block mr-2">
                                {product.title}
                            </h1>
                            <span className="text-gray-400 text-sm">({product.category})</span>
                        </div>

                        <div className="bg-white border rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h2 className="text-lg font-bold text-gray-900">Price Calculator</h2>
                                <button className="text-blue-600 text-sm hover:underline flex items-center">
                                    <span className="mr-1">Share Product</span>
                                </button>
                            </div>

                            {Object.keys(product.options).map((key) => (
                                <ProductOptionSelect
                                    key={key}
                                    label={key}
                                    options={product.options[key]}
                                    value={selections[key]}
                                    onChange={(val) => handleOptionChange(key, val)}
                                />
                            ))}

                            <PriceSummary
                                price={calculatePrice()}
                                onAddToCart={handleAddToCart}
                                onBuyNow={handleBuyNow}
                            />
                        </div>

                        {/* Extra Info */}
                        <div className="mt-6 flex items-center text-blue-600 text-sm cursor-pointer hover:underline">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Shipping Cost Estimation
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductCustomizerPage;
