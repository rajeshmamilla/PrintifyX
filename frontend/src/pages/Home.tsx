import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
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

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "ADMIN") {
      navigate("/admin/dashboard");
    }
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
            <h2 className="text-2xl font-bold text-gray-900">
              Shop Our Trending Categories
            </h2>
            <p className="text-gray-600 mt-2">
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
                {/* SET 1 */}
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <CategoryCard
                      title="Business Cards"
                      image={businessCards}
                      link="/categories/business-cards"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <CategoryCard title="Postcards" image={postcards} />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <CategoryCard title="Banners" image={banners} />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <CategoryCard title="Brochures & Flyers" image={flyers} />
                  </div>
                </CarouselItem>

                {/* SET 2 (Duplicated exactly to enable flawless infinite scroll physics) */}
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <CategoryCard
                      title="Business Cards"
                      image={businessCards}
                      link="/categories/business-cards"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <CategoryCard title="Postcards" image={postcards} />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <CategoryCard title="Banners" image={banners} />
                  </div>
                </CarouselItem>
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <CategoryCard title="Brochures & Flyers" image={flyers} />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* TRUST */}
      </main>

      <Footer />
    </>
  );
};

export default Home;
