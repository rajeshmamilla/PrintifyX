import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { getTrendingProducts } from "../services/api";
import { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";


const Home = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "ADMIN") {
      navigate("/admin/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const products = await getTrendingProducts();
        setTrendingProducts(products);
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


        {/* TRENDING PRODUCTS SECTION */}
        <section id="trending" className="bg-white py-24">
          <div className="mx-auto max-w-[1200px] px-8">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Trending Now</h2>
              <p className="text-gray-500 mt-2 font-medium italic">Hand-picked bestsellers ready for your design.</p>
            </div>

            <div className="px-10">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 md:-ml-8">
                  {trendingProducts.length > 0 ? (
                    trendingProducts.map((product, index) => (
                      <CarouselItem key={product.id} className="pl-4 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <div
                            onClick={() => navigate(`/products/${product.slug}`)}
                            className="group cursor-pointer"
                          >
                            <div className="relative aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden mb-6 border border-gray-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-orange-100 group-hover:-translate-y-2">
                              <img
                                src={product.imageUrl || "/placeholder-product.jpg"}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-orange-600 uppercase tracking-wider border border-orange-100 shadow-sm z-10">
                                Trending #{index + 1}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                <span className="w-full py-3 bg-white text-black text-center rounded-xl font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                  Customize Design
                                </span>
                              </div>
                            </div>
                            <div className="px-2 text-center">
                              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors leading-tight">
                                {product.name}
                              </h3>
                              <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                                Starting at <span className="text-gray-900">₹{product.basePrice}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    // Skeleton loading or empty state
                    [1, 2, 3].map((i) => (
                      <CarouselItem key={i} className="pl-4 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <div className="animate-pulse">
                            <div className="aspect-[4/5] bg-gray-100 rounded-[2rem] mb-6"></div>
                            <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
                <CarouselPrevious className="-left-12 h-12 w-12 border-none bg-white shadow-xl hover:bg-orange-500 hover:text-white transition-all" />
                <CarouselNext className="-right-12 h-12 w-12 border-none bg-white shadow-xl hover:bg-orange-500 hover:text-white transition-all" />
              </Carousel>
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
