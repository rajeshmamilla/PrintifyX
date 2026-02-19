import { Link } from "react-router-dom";

type CategoryCardProps = {
  title: string;
  image: string;
  link?: string;
};

const CategoryCard = ({ title, image, link }: CategoryCardProps) => {
  const CardContent = (
    <>
      {/* Image */}
      <div className="h-[220px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Title */}
      <div className="py-4 text-center">
        <h3 className="text-[16px] font-semibold text-gray-800">{title}</h3>
      </div>
    </>
  );

  const className =
    "group rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition cursor-pointer";

  if (link) {
    return (
      <Link to={link} className={className}>
        {CardContent}
      </Link>
    );
  }

  return <div className={className}>{CardContent}</div>;
};

export default CategoryCard;
