import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import { getTrendingProducts, getTrendingCategories } from "../services/api";
import { useState } from "react";
import businessCards from "../assets/categories/business-cards.jpg";
import postcards from "../assets/categories/post-cards.jpg";
import banners from "../assets/categories/banner-cards.jpg";
import flyers from "../assets/categories/flyer-card.jpg";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

const categoryImageMap: Record<string, string> = {
  "business-cards": businessCards,
  "postcards": postcards,
  "banners": banners,
  "brochures-flyers": flyers,
  "marketing-materials": flyers,
};

const Home = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<any[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "ADMIN") {
      navigate("/admin/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const [products, categories] = await Promise.all([
          getTrendingProducts(),
          getTrendingCategories()
        ]);
        setTrendingProducts(products);
        setTrendingCategories(categories);
      } catch (error) {
        console.error("Failed to fetch trending data:", error);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <>
      <Header />
      <Navbar />

      <main className="min-h-[70vh]">
        {/* HERO */}
        <Hero />

        <section id="categories" className="bg-[#f5f8fb] py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
              Shop Our Top Categories
            </h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
            <p className="text-gray-500 mt-4 font-medium italic">
              Our best selling products great for any occasion
            </p>
          </div>

          <div className="mx-auto max-w-[1200px] px-14 sm:px-16">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {trendingCategories.length > 0 ? (
                  // Double the items for infinite scroll physics as originally implemented
                  [...trendingCategories, ...trendingCategories].map((cat, index) => (
                    <CarouselItem key={`${cat.id}-${index}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                      <div className="p-1">
                        <CategoryCard
                          title={cat.name}
                          image={categoryImageMap[cat.slug] || businessCards}
                          link={`/categories/${cat.slug}`}
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  // Skeleton state for categories
                  [1, 2, 3].map((i) => (
                    <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                      <div className="p-1">
                        <div className="h-[280px] bg-gray-100 rounded-xl animate-pulse"></div>
                      </div>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* TRENDING PRODUCTS SECTION */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-[1200px] px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Trending Now</h2>
                <p className="text-gray-500 mt-2 font-medium italic">Hand-picked bestsellers ready for your design.</p>
              </div>
              <div className="h-[2px] flex-1 bg-gray-100 mx-10 mb-4 hidden md:block"></div>
              <button
                onClick={() => navigate('/categories/business-cards')}
                className="text-sm font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors"
              >
                View All Collection
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.length > 0 ? (
                trendingProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.slug}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden mb-6 border border-gray-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-orange-100 group-hover:-translate-y-2">
                      <img
                        src={product.imageUrl || "/placeholder-product.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-orange-600 uppercase tracking-wider border border-orange-100 shadow-sm">
                        Trending
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <span className="w-full py-3 bg-white text-black text-center rounded-xl font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          Customize Design
                        </span>
                      </div>
                    </div>
                    <div className="px-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                        Starting at <span className="text-gray-900">₹{product.basePrice}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // Skeleton loading or empty state
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-gray-100 rounded-[2rem] mb-6"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* TRUST */}
      </main>

      <Footer />
    </>
  );
};

export default Home;
