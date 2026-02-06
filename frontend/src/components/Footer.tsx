import {
  Facebook,
  Twitter,
  Youtube,
  Pin,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0b1730] to-[#070f22] text-gray-300">
      {/* TOP SECTION */}
      <div className="mx-auto max-w-[1300px] px-10 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* SUPPORT */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-white">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#">FAQs</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Download Templates</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Request a Quote</a></li>
              <li><a href="#">Testimonials</a></li>
              <li><a href="#">Privacy & Security Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#">Templates</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">File Preparation Guide</a></li>
              <li><a href="#">Tutorials</a></li>
              <li><a href="#">Reviews</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* MY ACCOUNT */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-white">
              My Account
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#">Reviews</a></li>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Blogs</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">View All</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* ABOUT */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-white">
              About
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#">Track My Order</a></li>
              <li><a href="#">My Orders</a></li>
              <li><a href="#">Reorder</a></li>
              <li><a href="#">Request Quote</a></li>
              <li><a href="#">Saved Designs</a></li>
              <li><a href="#">Reviews</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-white">
              Talk to PrintifyX
            </h4>

            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={16} /> Hyderabad, Telangana - 500081
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} /> Call (214)-432-0563
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} /> Chat with an Expert
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} /> Email Us
              </li>
            </ul>

            {/* SOCIAL ICONS */}
            <div className="mt-6 flex gap-4">
              <a href="#" className="hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-white">
                <Youtube size={18} />
              </a>
              <a href="#" className="hover:text-white">
                <Pin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-400">
        © 2026 PrintifyX. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
