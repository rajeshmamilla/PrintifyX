import { useEffect, useState } from "react";
import Hero1 from "../assets/categories/Hero1.jpg";
import Hero2 from "../assets/categories/Hero2.jpg";

const images = [Hero1, Hero2];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[420px] w-full overflow-hidden">
      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Hero background"
            className={`
              absolute inset-0 h-full w-full object-cover
              transition-opacity duration-1000 ease-in-out
              ${index === current ? "opacity-60" : "opacity-0"}
            `}
          />
        ))}

        {/* WHITE OVERLAY */}
        <div className="absolute inset-0 bg-white/45" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[520px] flex-col items-center justify-center px-6 text-center">
        <h2 className="mb-2 text-[36px] font-bold text-black">
          High Quality Printing Services
        </h2>

        <p className="text-[18px] text-gray-700">
          Business cards, banners, posters & more
        </p>

        <a
          href="#categories"
          className="mt-10 rounded border border-black px-10 py-2 text-black font-bold transition-all duration-400 hover:bg-black hover:text-white inline-block uppercase tracking-[0.2em] text-sm"
        >
          Order Now
        </a>
      </div>
    </section>
  );
};

export default Hero;
