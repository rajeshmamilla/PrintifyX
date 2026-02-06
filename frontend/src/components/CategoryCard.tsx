type CategoryCardProps = {
  title: string;
  image: string;
};

const CategoryCard = ({ title, image }: CategoryCardProps) => {
  return (
    <div className="group rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition cursor-pointer">
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
    </div>
  );
};

export default CategoryCard;
