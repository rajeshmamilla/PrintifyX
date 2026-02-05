// import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      {/* <TopBar /> */} 
      {/* /* Temporarily removed TopBar for cleaner UI */ }
      <Header />
      <Navbar />

      <main>
       <section className="hero">
            <h2>High Quality Printing Services</h2>
            <p>Business cards, banners, posters & more</p>
            <button className="hero-btn">Shop Now</button>
       </section>


        <section className="categories">
          <div className="category">Business Cards</div>
          <div className="category">Flyers</div>
          <div className="category">Banners</div>
          <div className="category">Posters</div>
        </section>
        <section className="trust">
            <h3>Trusted by 10,000+ Businesses</h3>
            <p>Fast turnaround • Premium quality • Affordable pricing</p>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Home;
