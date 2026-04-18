import {
  MapPin,
  Mail,
  Star,
  Linkedin,
  Github,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0b1730] to-[#070f22] text-gray-300">
      {/* TRUST BANNER: 10,000+ HAPPY CUSTOMERS */}
      <div className="border-b border-white/5">
        <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-center px-10 py-8 text-center md:py-12">
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Join 10,000+ Happy Customers
          </h3>
          <div className="mb-3 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-6 w-6 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              />
            ))}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
            Rated 4.9/5 based on customer and business reviews. <br className="hidden md:block" />
            <span className="mt-1 inline-block font-medium text-gray-300">
              Fast turnaround • Premium quality • Affordable pricing
            </span>
          </p>
        </div>
      </div>

      {/* MAIN FOOTER LINKS */}
      <div className="mx-auto max-w-[1300px] px-10 py-10 md:py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* COLUMN 1: SHOP */}
          <div className="flex flex-col items-center text-center">
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h4>
            <ul className="flex flex-col items-center space-y-3 text-sm">
              <li>
                <a href="/categories/business-cards" className="transition-colors hover:text-white">Business Cards</a>
              </li>
              <li>
                <a href="#flyers" className="transition-colors hover:text-white">Flyers</a>
              </li>
              <li>
                <a href="#banners" className="transition-colors hover:text-white">Banners</a>
              </li>
              <li>
                <a href="#posters" className="transition-colors hover:text-white">Posters</a>
              </li>
              <li>
                <a href="#stickers" className="transition-colors hover:text-white">Stickers</a>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: MY ACCOUNT */}
          <div className="flex flex-col items-center text-center">
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              My Account
            </h4>
            <ul className="flex flex-col items-center space-y-3 text-sm">
              <li>
                <a href="/login" className="transition-colors hover:text-white">Login</a>
              </li>
              <li>
                <a href="/register" className="transition-colors hover:text-white">Register</a>
              </li>
              <li>
                <a href="/profile" className="transition-colors hover:text-white">My Orders</a>
              </li>
              <li>
                <a href="/cart" className="transition-colors hover:text-white">Cart</a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CONTACT */}
          <div className="flex flex-col items-center text-center">
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="flex flex-col items-center space-y-4 text-sm">
              <li className="flex items-center justify-center gap-2">
                <Mail size={18} className="shrink-0" />
                <a href="mailto:rajeshmamilla206@gmail.com" className="transition-colors hover:text-white">rajeshmamilla206@gmail.com</a>
              </li>
              <li className="flex items-start justify-center gap-2">
                <MapPin size={18} className="shrink-0" />
                <span>Hyderabad, India</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <Linkedin size={18} className="shrink-0" />
                <a href="https://www.linkedin.com/in/rajeshmamilla/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center justify-center gap-2">
                <Github size={18} className="shrink-0" />
                <a href="https://github.com/rajeshmamilla/printifyx" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 bg-[#060a17]">
        <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-center px-10 py-6 text-sm text-gray-400">
          <p>© 2026 PrintifyX. Built by Rajesh Mamilla</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

