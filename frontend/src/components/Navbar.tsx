import { useState } from "react";
const MENU_DATA: Record<
  Exclude<MenuType, null>,
  {
    title: string;
    items: string[];
  }[]
> = {
  business: [
    {
      title: "Business Cards",
      items: ["Standard Business Cards", "Plastic Business Cards"],
    },
    {
      title: "Postcards",
      items: ["Standard Postcards", "EDDM Postcards"],
    },
    {
      title: "Flyers & Brochures",
      items: ["Business Flyers", "Club Flyers"],
    },
  ],

  flyers: [
    {
      title: "Flyers",
      items: ["Standard Flyers", "Premium Flyers", "Club Flyers"],
    },
    {
      title: "Brochures",
      items: ["Bi-Fold", "Tri-Fold", "Z-Fold"],
    },
    {
      title: "Menus",
      items: ["Restaurant Menus", "Takeout Menus"],
    },
  ],

  banners: [
    {
      title: "Banners",
      items: ["Vinyl Banners", "Mesh Banners", "Fabric Banners"],
    },
    {
      title: "Displays",
      items: ["Roll-Up Banners", "X-Stand Displays"],
    },
    {
      title: "Outdoor",
      items: ["Fence Banners", "Pole Banners"],
    },
  ],

  posters: [
    {
      title: "Posters",
      items: ["Paper Posters", "Photo Posters"],
    },
    {
      title: "Large Format",
      items: ["Foam Board", "Mounted Posters"],
    },
    {
      title: "Events",
      items: ["Movie Posters", "Event Posters"],
    },
  ],

  stickers: [
    {
      title: "Stickers",
      items: ["Die-Cut Stickers", "Kiss-Cut Stickers"],
    },
    {
      title: "Labels",
      items: ["Product Labels", "Bottle Labels"],
    },
    {
      title: "Decals",
      items: ["Window Decals", "Wall Decals"],
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
          Business Cards
        </li>
        <li
          onMouseEnter={() => setActiveMenu("flyers")}
          className="cursor-pointer hover:underline"
        >
          Flyers
        </li>
        <li
          onMouseEnter={() => setActiveMenu("banners")}
          className="cursor-pointer hover:underline"
        >
          Banners
        </li>
        <li
          onMouseEnter={() => setActiveMenu("posters")}
          className="cursor-pointer hover:underline"
        >
          Posters
        </li>
        <li
          onMouseEnter={() => setActiveMenu("stickers")}
          className="cursor-pointer hover:underline"
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
                {section.items.map((item) => (
                  <p
                    key={item}
                    className="cursor-pointer text-[14px] hover:text-orange-500"
                  >
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
