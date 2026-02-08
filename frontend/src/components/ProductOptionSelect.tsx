import React from "react";

interface ProductOptionSelectProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

const ProductOptionSelect: React.FC<ProductOptionSelectProps> = ({
    label,
    options,
    value,
    onChange,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-gray-100 last:border-b-0">
            <label className="text-sm font-semibold text-gray-700 w-full md:w-1/3 mb-1 md:mb-0">
                {label}
            </label>
            <div className="relative w-full md:w-2/3">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800 cursor-pointer pr-10"
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="No content provided with the request."
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ProductOptionSelect;
