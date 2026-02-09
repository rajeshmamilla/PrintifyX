import { useState, useEffect } from "react";
import { Plus, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";

const CategoryManagement = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8081/api/admin/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            setProcessingId(id);
            const res = await fetch(`http://localhost:8081/api/admin/categories/${id}/status`, {
                method: "PATCH",
            });
            if (res.ok) {
                fetchCategories();
            }
        } catch (error) {
            console.error("Error toggling category status:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8081/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCategory),
            });
            if (res.ok) {
                setShowModal(false);
                setNewCategory({ name: "", slug: "" });
                fetchCategories();
            }
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Category Management</h2>
                    <p className="text-gray-500 text-sm">Organize and manage your product categories.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Name</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Slug</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{cat.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {cat.isActive ? "ACTIVE" : "INACTIVE"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        disabled={processingId === cat.id}
                                        onClick={() => handleToggleStatus(cat.id)}
                                        className={`flex items-center gap-2 text-sm font-bold transition-colors ${cat.isActive ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"
                                            }`}
                                    >
                                        {processingId === cat.id ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : cat.isActive ? (
                                            <ToggleRight size={24} />
                                        ) : (
                                            <ToggleLeft size={24} />
                                        )}
                                        <span>{cat.isActive ? "Disable" : "Enable"}</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Category</h3>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Business Cards"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. business-cards"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                                    value={newCategory.slug}
                                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
