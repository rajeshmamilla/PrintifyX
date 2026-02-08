import { Link } from "react-router-dom";

interface CategoryProductCardProps {
    title: string;
    image: string;
    link: string;
}

const CategoryProductCard: React.FC<CategoryProductCardProps> = ({
    title,
    image,
    link,
}) => {
    return (
        <Link
            to={link}
            className="group flex flex-col items-center bg-white p-6 rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-md mb-4 bg-gray-50">
                <img
                    src={image}
                    alt={title}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {title}
            </h3>
        </Link>
    );
};

export default CategoryProductCard;
