import React from "react";

interface PriceSummaryProps {
    price: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
    price,
    onAddToCart,
    onBuyNow,
}) => {
    const formattedPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price);

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-3xl font-bold text-blue-600">{formattedPrice}</span>
            </div>

            <div className="flex flex-row gap-4">
                <button
                    onClick={onAddToCart}
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center shadow-md text-sm"
                >
                    Add to Cart
                </button>
                <button
                    onClick={onBuyNow}
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center shadow-md text-sm"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default PriceSummary;
