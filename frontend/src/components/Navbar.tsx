import { useState } from "react";
import { Link } from "react-router-dom";

const MENU_DATA: Record<
  Exclude<MenuType, null>,
  {
    title: string;
    items: { name: string; path?: string }[];
  }[]
> = {
  business: [
    {
      title: "Business Cards",
      items: [
        { name: "Standard Business Cards", path: "/products/standard-business-cards" },
        { name: "Plastic Business Cards", path: "/products/plastic-business-cards" },
      ],
    },
    {
      title: "Postcards",
      items: [
        { name: "Standard Postcards" },
        { name: "EDDM Postcards" }
      ],
    },
    {
      title: "Flyers & Brochures",
      items: [
        { name: "Business Flyers" },
        { name: "Club Flyers" }
      ],
    },
  ],

  flyers: [
    {
      title: "Flyers",
      items: [
        { name: "Standard Flyers" },
        { name: "Premium Flyers" },
        { name: "Club Flyers" }
      ],
    },
    {
      title: "Brochures",
      items: [
        { name: "Bi-Fold" },
        { name: "Tri-Fold" },
        { name: "Z-Fold" }
      ],
    },
    {
      title: "Menus",
      items: [
        { name: "Restaurant Menus" },
        { name: "Takeout Menus" }
      ],
    },
  ],

  banners: [
    {
      title: "Banners",
      items: [
        { name: "Vinyl Banners" },
        { name: "Mesh Banners" },
        { name: "Fabric Banners" }
      ],
    },
    {
      title: "Displays",
      items: [
        { name: "Roll-Up Banners" },
        { name: "X-Stand Displays" }
      ],
    },
    {
      title: "Outdoor",
      items: [
        { name: "Fence Banners" },
        { name: "Pole Banners" }
      ],
    },
  ],

  posters: [
    {
      title: "Posters",
      items: [
        { name: "Paper Posters" },
        { name: "Photo Posters" }
      ],
    },
    {
      title: "Large Format",
      items: [
        { name: "Foam Board" },
        { name: "Mounted Posters" }
      ],
    },
    {
      title: "Events",
      items: [
        { name: "Movie Posters" },
        { name: "Event Posters" }
      ],
    },
  ],

  stickers: [
    {
      title: "Stickers",
      items: [
        { name: "Die-Cut Stickers" },
        { name: "Kiss-Cut Stickers" }
      ],
    },
    {
      title: "Labels",
      items: [
        { name: "Product Labels" },
        { name: "Bottle Labels" }
      ],
    },
    {
      title: "Decals",
      items: [
        { name: "Window Decals" },
        { name: "Wall Decals" }
      ],
    },
  ],
};

type MenuType =
  | "business"
  | "flyers"
  | "banners"
  | "posters"
  | "stickers"
  | null;

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);

  const handlePlaceholderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("This page is yet to develop, Try Business cards");
  };

  return (
    <nav
      className="relative bg-[#2b2b2b] h-[58px]"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* NAV ITEMS */}
      <ul className="flex h-full items-center justify-center gap-10 text-white font-semibold">
        <li
          onMouseEnter={() => setActiveMenu("business")}
          className="cursor-pointer hover:underline"
        >
          <Link to="/categories/business-cards">Business Cards</Link>
        </li>
        <li
          onMouseEnter={() => setActiveMenu("flyers")}
          className="cursor-pointer hover:underline"
          onClick={handlePlaceholderClick}
        >
          Flyers
        </li>
        <li
          onMouseEnter={() => setActiveMenu("banners")}
          className="cursor-pointer hover:underline"
          onClick={handlePlaceholderClick}
        >
          Banners
        </li>
        <li
          onMouseEnter={() => setActiveMenu("posters")}
          className="cursor-pointer hover:underline"
          onClick={handlePlaceholderClick}
        >
          Posters
        </li>
        <li
          onMouseEnter={() => setActiveMenu("stickers")}
          className="cursor-pointer hover:underline"
          onClick={handlePlaceholderClick}
        >
          Stickers
        </li>
      </ul>

      {/* MEGA MENU */}
      {activeMenu && (
        <div
          className="
          absolute left-1/2 top-full
          -translate-x-1/2
          w-[80%]
          bg-white
          shadow-xl
          z-[100]
        "
        >
          <div className="mx-auto grid max-w-[1100px] grid-cols-3 gap-10 px-10 py-8">
            {MENU_DATA[activeMenu].map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 text-[16px] font-semibold">
                  {section.title}
                </h4>
                {section.items.map((item) => {
                  const isBusinessCard = section.title === "Business Cards";
                  return item.path && isBusinessCard ? (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block cursor-pointer text-[14px] hover:text-orange-500 mb-1"
                      onClick={() => setActiveMenu(null)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <p
                      key={item.name}
                      className="cursor-pointer text-[14px] hover:text-orange-500 mb-1"
                      onClick={handlePlaceholderClick}
                    >
                      {item.name}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
