import { useState } from "react";

type MenuType = "business" | null;

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);

  return (
    <nav
      className="relative bg-[#2b2b2b]"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* NAV ITEMS */}
      <ul className="flex justify-center gap-10 py-[18px] text-white font-semibold">
        <li
          className="cursor-pointer hover:underline"
          onMouseEnter={() => setActiveMenu("business")}
        >
          Business Cards
        </li>
        <li className="cursor-pointer hover:underline">Flyers</li>
        <li className="cursor-pointer hover:underline">Banners</li>
        <li className="cursor-pointer hover:underline">Posters</li>
        <li className="cursor-pointer hover:underline">Stickers</li>
      </ul>

      {/* MEGA MENU */}
      {activeMenu === "business" && (
        <div
          className="
            absolute top-full left-1/2 -translate-x-1/2
            w-[80%]
            bg-white
            shadow-xl
            z-50
            transition-all duration-300 ease-out
            opacity-100 translate-y-0
          "
        >
          <div className="mx-auto grid max-w-[1100px] grid-cols-3 gap-10 px-10 py-8">
            <div>
              <h4 className="mb-2 text-[16px] font-semibold">Business Cards</h4>
              <p className="cursor-pointer text-[14px] hover:text-orange-500">
                Standard Business Cards
              </p>
              <p className="cursor-pointer text-[14px] hover:text-orange-500">
                Plastic Business Cards
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-[16px] font-semibold">Postcards</h4>
              <p className="cursor-pointer text-[14px] hover:text-orange-500">
                Standard Postcards
              </p>
              <p className="cursor-pointer text-[14px] hover:text-orange-500">
                EDDM Postcards
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-[16px] font-semibold">
                Flyers & Brochures
              </h4>
              <p className="cursor-pointer text-[14px] hover:text-orange-500">
                Business Flyers
              </p>
              <p className="cursor-pointer text-[14px] hover:text-orange-500">
                Club Flyers
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
