import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductOptionSelect from "../components/ProductOptionSelect";
import PriceSummary from "../components/PriceSummary";
import { cartService } from "../services/cart.service";
import { Upload, Grid, Edit3, X } from "lucide-react";

// Import images
import plasticBusinessCardsImg from "../assets/products/plastic business cards.png";
import standardBusinessCardsImg from "../assets/products/standard business cards.png";

const ProductCustomizerPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>(); // productId is the slug
    
    const [productData, setProductData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selections, setSelections] = useState<Record<string, string>>({});

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

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${baseUrl}/products/slug/${productId}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Product not found");
                    } else {
                        setError("Failed to load product");
                    }
                    return;
                }
                
                const data = await response.json();
                setProductData(data);
                
                // Initialize selections from variants
                const groups: Record<string, string[]> = {};
                data.variants.forEach((v: any) => {
                    const name = v.variantName;
                    if (name.includes(":")) {
                        const [cat, val] = name.split(":").map((s: string) => s.trim());
                        if (!groups[cat]) groups[cat] = [];
                        if (!groups[cat].includes(val)) groups[cat].push(val);
                    } else {
                        const cat = "Options";
                        const val = name.trim();
                        if (!groups[cat]) groups[cat] = [];
                        if (!groups[cat].includes(val)) groups[cat].push(val);
                    }
                });

                const initialSelections: Record<string, string> = {};
                Object.keys(groups).forEach(key => {
                    initialSelections[key] = groups[key][0];
                });
                setSelections(initialSelections);
                
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("An error occurred while fetching product data");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductData();
        }
    }, [productId]);

    useEffect(() => {
        const storedEmail = localStorage.getItem("email") || localStorage.getItem("userEmail") || "";
        const storedName = localStorage.getItem("businessName") || localStorage.getItem("name") || localStorage.getItem("firstName") || "";
        const storedAddress = localStorage.getItem("address") || "";
        const storedPhone = localStorage.getItem("phone") || localStorage.getItem("contactNumber") || "";
        
        setCardDetails(prev => ({
            ...prev,
            email: prev.email || storedEmail,
            businessName: prev.businessName || storedName,
            address: prev.address || storedAddress,
            contactNumber: prev.contactNumber || storedPhone
        }));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading product details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !productData) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">{error || "Product Not Found"}</h1>
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
        let total = productData.basePrice || 0;
        const qty = parseInt(selections["Quantity"] || "100");
        total *= qty;
        
        if (selections["Printing Sides"] === "Double Sided") {
            total += 200;
        }
        return total;
    };

    const getProductImage = () => {
        if (productData.imageUrl) return productData.imageUrl;
        // Fallback to local imports based on slug
        if (productId === "plastic-business-cards") return plasticBusinessCardsImg;
        if (productId === "standard-business-cards") return standardBusinessCardsImg;
        // Default to standard image for any other slug as a safe fallback
        return standardBusinessCardsImg;
    };

    const getProductOptions = () => {
        const groups: Record<string, string[]> = {};
        productData.variants.forEach((v: any) => {
            const name = v.variantName;
            if (name.includes(":")) {
                const [cat, val] = name.split(":").map((s: string) => s.trim());
                if (!groups[cat]) groups[cat] = [];
                if (!groups[cat].includes(val)) groups[cat].push(val);
            } else {
                const cat = "Options";
                const val = name.trim();
                if (!groups[cat]) groups[cat] = [];
                if (!groups[cat].includes(val)) groups[cat].push(val);
            }
        });
        return groups;
    };

    const handleAddToCart = async (showAlert = true) => {
        const token = localStorage.getItem("token");
        const isTokenValid = token && token !== "undefined" && token !== "null";

        if (!isTokenValid) {
            navigate("/login");
            return;
        }

        if (!cardDetails.businessName.trim() || !cardDetails.address.trim()) {
            alert("Please fill in the required fields: Business Name and Address.");
            return;
        }

        try {
            const quantity = parseInt(selections["Quantity"] || "100");
            const totalPrice = calculatePrice();
            const unitPrice = totalPrice / quantity;

            await cartService.addItem({
                productId: productData.id,
                productName: productData.name,
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
                            <Link to={`/categories/${productData.categorySlug}`} className="hover:text-blue-600 text-blue-600">
                                {productData.categoryName}
                            </Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="text-gray-900 font-medium">{productData.name}</li>
                    </ol>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Image Gallery & Options/Upload */}
                    <div className="w-full lg:w-1/2 space-y-4">
                        <ProductImageGallery image={getProductImage()} alt={productData.name} />

                        {/* Options and Uploads Section */}
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2 border-b pb-2">
                                <h2 className="text-lg font-bold text-gray-900">Customize & Upload</h2>
                                <button className="text-blue-600 text-sm hover:underline flex items-center">
                                    <span className="mr-1">Share Product</span>
                                </button>
                            </div>

                            {/* Upload Sample Section */}
                            <div className="mb-4">
                                {selectedFile && (
                                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Upload size={16} className="text-blue-600 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 truncate font-medium">
                                                {selectedFile}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleRemoveFile}
                                            className="p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                                            title="Remove file"
                                        >
                                            <X size={16} />
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
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#2196F3] hover:bg-[#1E88E5] text-white font-bold rounded shadow-sm transition-colors"
                                >
                                    <Upload size={18} />
                                    <span className="tracking-wider uppercase text-sm">Upload Sample</span>
                                </button>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-4 mt-4">
                                <div className="mb-3 sm:mb-0">
                                    <span className="text-base font-semibold text-gray-800">Quantity</span>
                                    <div className="text-sm text-gray-500 mt-1">
                                        ₹{productData.basePrice?.toLocaleString()} / unit
                                    </div>
                                </div>
                                <div className="flex items-center border border-gray-300 bg-white rounded-md overflow-hidden shadow-sm">
                                    <button 
                                        className="w-12 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 border-r border-gray-300 transition-colors text-lg font-medium"
                                        onClick={() => {
                                            const current = parseInt(selections["Quantity"] || "100");
                                            if (current > 100) handleOptionChange("Quantity", (current - 100).toString());
                                        }}
                                    >-</button>
                                    <input 
                                        type="number" 
                                        className="w-20 h-10 text-center text-base font-medium outline-none text-gray-800"
                                        value={selections["Quantity"] || "100"}
                                        onChange={(e) => handleOptionChange("Quantity", e.target.value)}
                                        min="100"
                                        step="100"
                                    />
                                    <button 
                                        className="w-12 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 border-l border-gray-300 transition-colors text-lg font-medium"
                                        onClick={() => {
                                            const current = parseInt(selections["Quantity"] || "100");
                                            handleOptionChange("Quantity", (current + 100).toString());
                                        }}
                                    >+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Title, Card Details & Price Summary */}
                    <div className="w-full lg:w-1/2">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 inline-block mr-2">
                                {productData.name}
                            </h1>
                            <span className="text-gray-400 text-sm">({productData.categoryName})</span>
                        </div>

                        <div className="space-y-4">
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
                                        <label className="text-sm font-semibold text-gray-700">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={cardDetails.address}
                                            onChange={(e) => setCardDetails({ ...cardDetails, address: e.target.value })}
                                            placeholder="Enter full address"
                                            className="w-full h-9 px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                                            required
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

                            {/* Price Summary Section */}
                            <div className="bg-white border rounded-lg p-4 shadow-sm">
                                <PriceSummary
                                    price={calculatePrice()}
                                    onAddToCart={handleAddToCart}
                                    onBuyNow={handleBuyNow}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductCustomizerPage;
