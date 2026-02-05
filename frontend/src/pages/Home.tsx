import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <TopBar />
      <Header />
      <Navbar />

      <main>
        <section className="hero">
          <h2>High Quality Printing Services</h2>
          <p>Business cards, banners, posters & more</p>
        </section>

        <section className="categories">
          <div className="category">Business Cards</div>
          <div className="category">Flyers</div>
          <div className="category">Banners</div>
          <div className="category">Posters</div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
