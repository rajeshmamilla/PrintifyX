import { Link } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryProductCard from "../components/CategoryProductCard";

// Import images
import plasticBusinessCardsImg from "../assets/products/plastic business cards.png";
import standardBusinessCardsImg from "../assets/products/standard business cards.png";

const BusinessCardsCategory = () => {
    const products = [
        {
            title: "Plastic Business Cards",
            image: plasticBusinessCardsImg,
            link: "/products/plastic-business-cards",
        },
        {
            title: "Standard Business Cards",
            image: standardBusinessCardsImg,
            link: "/products/standard-business-cards",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-6 py-12">
                {/* Page Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Cards</h1>

                {/* Breadcrumb */}
                <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
                    <ol className="flex list-none p-0">
                        <li className="flex items-center">
                            <Link to="/" className="hover:text-blue-600">Home</Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="text-gray-900 font-medium">Business Cards</li>
                    </ol>
                </nav>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-12 max-w-2xl">
                    Create attractive business cards with premium finishes to promote your brand.
                </p>

                {/* Product Type Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {products.map((product) => (
                        <CategoryProductCard
                            key={product.link}
                            title={product.title}
                            image={product.image}
                            link={product.link}
                        />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BusinessCardsCategory;
