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
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/categories/with-products`);
        if (response.ok) {
          const data = await response.json();
          setNavCategories(data);
        }
      } catch (error) {
        console.error("Error fetching navbar categories:", error);
      } finally {
        setLoading(false);
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
      <ul className="flex h-full items-center justify-center gap-10 text-white font-semibold">
        {categoriesToRender.map((category) => (
          <li
            key={category.id}
            onMouseEnter={() => setActiveMenuId(category.id)}
            className="h-full flex items-center cursor-pointer hover:text-orange-500 transition-colors relative"
          >
            <Link 
              to={`/categories/${category.slug}`}
              className="hover:underline"
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
              <div
                className="
                  absolute left-0 top-full
                  w-64
                  bg-white
                  shadow-xl
                  z-[100]
                  border-t-2 border-orange-500
                  animate-in fade-in slide-in-from-top-1
                "
              >
                <div className="py-3">
                  {category.products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="block px-6 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors uppercase tracking-wide font-bold"
                      onClick={() => setActiveMenuId(null)}
                    >
                      {product.name}
                    </Link>
                  ))}
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
