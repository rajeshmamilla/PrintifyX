import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import businessCards from "../assets/categories/business-cards.jpg";
import postcards from "../assets/categories/post-cards.jpg";
import banners from "../assets/categories/banner-cards.jpg";
import flyers from "../assets/categories/flyer-card.jpg";

const Home = () => {
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

          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 sm:grid-cols-2 md:grid-cols-4">
            <CategoryCard
              title="Business Cards"
              image={businessCards}
              link="/categories/business-cards"
            />
            <CategoryCard title="Postcards" image={postcards} />
            <CategoryCard title="Banners" image={banners} />
            <CategoryCard title="Brochures & Flyers" image={flyers} />
          </div>
        </section>

        {/* TRUST */}
        <section className="bg-white px-10 py-10 text-center">
          <h3 className="mb-2 text-[20px] font-semibold">
            Join the 10,000+ Happy Customers
          </h3>
          <p className="text-gray-600">
            Fast turnaround • Premium quality • Affordable pricing
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
