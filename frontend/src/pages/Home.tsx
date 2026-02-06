import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <>
      <Header />
      <Navbar />

      <main className="min-h-[70vh]">
        {/* HERO */}
        <Hero />

        {/* CATEGORIES */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-10">
          <div className="cursor-pointer rounded bg-white p-[30px] text-center shadow transition-all hover:-translate-y-1 hover:shadow-lg">
            Marketing
          </div>
          <div className="cursor-pointer rounded bg-white p-[30px] text-center shadow transition-all hover:-translate-y-1 hover:shadow-lg">
            Flyers
          </div>
          <div className="cursor-pointer rounded bg-white p-[30px] text-center shadow transition-all hover:-translate-y-1 hover:shadow-lg">
            Banners
          </div>
          <div className="cursor-pointer rounded bg-white p-[30px] text-center shadow transition-all hover:-translate-y-1 hover:shadow-lg">
            Posters
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
