import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductOptionSelect from "../components/ProductOptionSelect";
import PriceSummary from "../components/PriceSummary";
import { cartService } from "../services/cart.service";
import { Upload, Grid, Edit3, X } from "lucide-react";
import { useRef } from "react";

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

    const [cardDetails, setCardDetails] = useState({
        businessName: "",
        tagline: "",
        contactNumber: "",
        email: "",
        website: "",
        address: "",
        instructions: ""
    });

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        const isTokenValid = token && token !== "undefined" && token !== "null";

        if (!isTokenValid) {
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
                customization: selections,
                cardDetails: cardDetails
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

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file.name);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
                    {/* Left: Image Gallery & Card Details */}
                    <div className="w-full lg:w-1/2 space-y-4">
                        <ProductImageGallery image={product.image} alt={product.title} />

                        {/* Card Details / Print Instructions Section */}
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                                Card Details / Print Instructions
                            </h2>
                            <div className="space-y-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Business Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={cardDetails.businessName}
                                        onChange={(e) => setCardDetails({ ...cardDetails, businessName: e.target.value })}
                                        placeholder="Enter your business name"
                                        className="w-full h-9 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700">Tagline / Short Description</label>
                                    <input
                                        type="text"
                                        value={cardDetails.tagline}
                                        onChange={(e) => setCardDetails({ ...cardDetails, tagline: e.target.value })}
                                        placeholder="e.g. Premium Printing Services"
                                        className="w-full h-9 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-semibold text-gray-700">Contact Number</label>
                                        <input
                                            type="text"
                                            value={cardDetails.contactNumber}
                                            onChange={(e) => setCardDetails({ ...cardDetails, contactNumber: e.target.value })}
                                            placeholder="+91 000 000 0000"
                                            className="w-full h-9 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-semibold text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={cardDetails.email}
                                            onChange={(e) => setCardDetails({ ...cardDetails, email: e.target.value })}
                                            placeholder="hello@example.com"
                                            className="w-full h-9 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700">Website</label>
                                    <input
                                        type="text"
                                        value={cardDetails.website}
                                        onChange={(e) => setCardDetails({ ...cardDetails, website: e.target.value })}
                                        placeholder="www.example.com"
                                        className="w-full h-9 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        value={cardDetails.address}
                                        onChange={(e) => setCardDetails({ ...cardDetails, address: e.target.value })}
                                        placeholder="Enter full address"
                                        className="w-full h-9 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700">Additional Instructions</label>
                                    <textarea
                                        value={cardDetails.instructions}
                                        onChange={(e) => setCardDetails({ ...cardDetails, instructions: e.target.value })}
                                        placeholder="Any specific layout or design requests..."
                                        rows={2}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Configurator */}
                    <div className="w-full lg:w-1/2">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 inline-block mr-2">
                                {product.title}
                            </h1>
                            <span className="text-gray-400 text-sm">({product.category})</span>
                        </div>

                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2 border-b pb-2">
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

                            <div className="mt-4 bg-[#0D121F] rounded-xl p-4 shadow-2xl">
                                <div className="space-y-2">
                                    {selectedFile && (
                                        <div className="flex items-center justify-between bg-[#1a1f2e] border border-gray-700 rounded p-2 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <Upload size={14} className="text-[#2196F3] flex-shrink-0" />
                                                <span className="text-xs text-gray-300 truncate font-medium">
                                                    {selectedFile}
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleRemoveFile}
                                                className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                                                title="Remove file"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*,.pdf,.ai,.psd"
                                    />

                                    <button
                                        onClick={handleUploadClick}
                                        className="w-full flex items-center justify-center gap-3 py-3 bg-[#2196F3] hover:bg-[#1E88E5] text-white font-bold rounded shadow-lg transition-all group"
                                    >
                                        <Upload size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="tracking-wider uppercase text-xs">Upload Design</span>
                                    </button>

                                    <button
                                        onClick={() => navigate("/browse-design")}
                                        className="w-full flex items-center justify-center gap-3 py-3 bg-[#2196F3] hover:bg-[#1E88E5] text-white font-bold rounded shadow-lg transition-all group"
                                    >
                                        <Grid size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="tracking-wider uppercase text-xs">Browse Design</span>
                                    </button>

                                    <button
                                        onClick={() => navigate("/create-design")}
                                        className="w-full flex items-center justify-center gap-3 py-3 bg-[#2196F3] hover:bg-[#1E88E5] text-white font-bold rounded shadow-lg transition-all group"
                                    >
                                        <Edit3 size={20} className="group-hover:scale-110 transition-transform" />
                                        <span className="tracking-wider uppercase text-xs">Custom Design</span>
                                    </button>
                                </div>
                            </div>

                            <PriceSummary
                                price={calculatePrice()}
                                onAddToCart={handleAddToCart}
                                onBuyNow={handleBuyNow}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductCustomizerPage;
