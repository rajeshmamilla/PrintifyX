import React from 'react';

interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

interface OrderItemsTableProps {
    items: OrderItem[];
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Product Name</th>
                        <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Unit Price</th>
                        <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Total Price</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 text-sm font-bold text-gray-800">{item.productName}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-4 text-sm text-gray-800 text-right">₹{item.unitPrice.toLocaleString()}</td>
                            <td className="px-4 py-4 text-sm font-black text-orange-600 text-right">₹{item.totalPrice.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-50 font-black">
                        <td colSpan={3} className="px-4 py-4 text-right text-gray-800">Total</td>
                        <td className="px-4 py-4 text-right text-orange-600">
                            ₹{items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default OrderItemsTable;
