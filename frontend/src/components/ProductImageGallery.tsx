import React from "react";

interface ProductImageGalleryProps {
    image: string;
    alt: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ image, alt }) => {
    return (
        <div className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
            <div className="aspect-square relative flex items-center justify-center p-4">
                <img
                    src={image}
                    alt={alt}
                    className="max-w-full max-h-full object-contain"
                />
                {/* Extensible: Navigation arrows for slider could go here */}
            </div>
            {/* Extensible: Thumbnail gallery could go here */}
        </div>
    );
};

export default ProductImageGallery;
