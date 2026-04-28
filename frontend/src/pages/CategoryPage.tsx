import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryProductCard from "../components/CategoryProductCard";

// Import images for fallback
import standardBusinessCardsImg from "../assets/products/standard business cards.png";

interface Product {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/categories/with-products`);
        
        if (response.ok) {
          const categories: Category[] = await response.json();
          const currentCategory = categories.find(c => c.slug === categorySlug);
          
          if (currentCategory) {
            setCategory(currentCategory);
          } else {
            setError("Category Not Found");
          }
        } else {
          setError("Failed to load category data");
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("An error occurred while loading");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Navbar />
        <main className="max-w-[1200px] mx-auto px-6 py-12 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Navbar />
        <main className="max-w-[1200px] mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{error || "Category Not Found"}</h1>
          <p className="text-gray-600 mb-8">This category selection is currently limited. Please explore our other products!</p>
          <Link to="/" className="text-blue-600 font-semibold hover:underline">Return Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>

        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <ol className="flex list-none p-0">
            <li className="flex items-center">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          Complete your professional look with our custom {category.name.toLowerCase()} products.
        </p>

        {/* Product Type Grid */}
        {category.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.products.map((product) => (
              <CategoryProductCard
                key={product.slug}
                title={product.name}
                image={standardBusinessCardsImg} // Fallback to standard image for grid display
                link={`/products/${product.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No products available</h2>
            <p className="text-gray-500">We're currently updating this category with new premium selections.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
