import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ProductSummary {
  id: number;
  name: string;
  slug: string;
}

interface CategoryWithProducts {
  id: number;
  name: string;
  slug: string;
  products: ProductSummary[];
}

const Navbar = () => {
  const [navCategories, setNavCategories] = useState<CategoryWithProducts[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const fallbackCategories = [
    { name: "Business Cards", slug: "business-cards" },
    { name: "Flyers", slug: "flyers" },
    { name: "Banners", slug: "banners" },
    { name: "Posters", slug: "posters" },
    { name: "Stickers", slug: "stickers" },
  ];

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/categories/with-products`);
        if (response.ok) {
          const data = await response.json();
          setNavCategories(data);
        }
      } catch (error) {
        console.error("Error fetching navbar categories:", error);
      }
    };

    fetchNavData();
  }, []);

  const handlePlaceholderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("This category selection is currently limited. Please explore our available products!");
  };

  const categoriesToRender = navCategories.length > 0 ? navCategories : fallbackCategories.map((c, i) => ({ ...c, id: -(i + 1), products: [] }));

  return (
    <nav
      className="relative bg-[#2b2b2b] h-[58px]"
      onMouseLeave={() => setActiveMenuId(null)}
    >
      {/* NAV ITEMS */}
      <ul className="flex h-full items-center justify-center gap-2 text-white">
        {categoriesToRender.map((category) => (
          <li
            key={category.id}
            onMouseEnter={() => setActiveMenuId(category.id)}
            className="h-full flex items-center relative"
          >
            <Link 
              to={`/categories/${category.slug}`}
              className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              onClick={(e) => {
                if (category.products.length === 0 && category.id < 0) {
                     handlePlaceholderClick(e);
                }
              }}
            >
              {category.name}
            </Link>

            {/* DROPDOWN */}
            {activeMenuId === category.id && category.products.length > 0 && (
              <div className="absolute left-0 top-full pt-2 z-[100]">
                <div
                  className="w-72 rounded-md border border-gray-200 bg-white p-2 shadow-md animate-in fade-in-0 zoom-in-95 duration-200"
                >
                  <div className="flex flex-col space-y-1">
                    {category.products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        className="block select-none rounded-md p-3 text-base font-medium leading-none text-gray-700 no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                        onClick={() => setActiveMenuId(null)}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
