import { useState, useEffect } from "react";
import { Plus, ToggleLeft, ToggleRight, Loader2, Filter } from "lucide-react";
import { fetchWithAuth } from "../../services/apiClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ProductManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [showModal, setShowModal] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        slug: "",
        description: "",
        basePrice: 0,
        categoryId: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                fetchWithAuth("/admin/products"),
                fetchWithAuth("/admin/categories")
            ]);
            const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()]);
            setProducts(prodData);
            setCategories(catData);
        } catch (error) {
            console.error("Error fetching product data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            setProcessingId(id);
            const res = await fetchWithAuth(`/admin/products/${id}/status`, {
                method: "PATCH",
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Error toggling product status:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            const formData = new FormData();
            
            // Append product data as a JSON blob part to match @RequestPart("product")
            const productData = {
                ...newProduct,
                basePrice: Number(newProduct.basePrice),
                categoryId: Number(newProduct.categoryId)
            };
            formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
            
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetchWithAuth("/admin/products", {
                method: "POST",
                body: formData, // fetch automatically sets the multipart/form-data boundary
            });
            if (res.ok) {
                setShowModal(false);
                setNewProduct({ name: "", slug: "", description: "", basePrice: 0, categoryId: "" });
                setImageFile(null);
                fetchData();
            }
        } catch (error) {
            console.error("Error creating product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProducts = filterCategory === "all"
        ? products
        : products.filter(p => p.category?.id.toString() === filterCategory);

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
                    <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                    <p className="text-gray-500 text-sm">Create and manage your products across categories.</p>
                </div>
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogTrigger render={<Button variant="secondary" className="flex items-center gap-2 shadow-sm font-bold" />}>
                        <Plus size={20} />
                        <span>Add Product</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg rounded-2xl bg-white p-8 overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-gray-800 mb-6">Add New Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                                        value={newProduct.slug}
                                        onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                <select
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    value={newProduct.categoryId}
                                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Base Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    value={newProduct.basePrice}
                                    onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 h-24"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer text-gray-500"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50"
                                >
                                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                                    {isSubmitting ? "Uploading..." : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <Filter size={18} />
                    <span>Filter by Category:</span>
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <div className="flex-1"></div>
                <div className="text-sm text-gray-500">
                    Showing <span className="font-bold text-gray-800">{filteredProducts.length}</span> products
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Product Name</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Category</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Price</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                    <p className="text-xs text-gray-400">{p.slug}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-medium">
                                        {p.category?.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-800">
                                    ₹{p.basePrice.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        disabled={processingId === p.id}
                                        onClick={() => handleToggleStatus(p.id)}
                                        className={`flex items-center gap-2 text-sm font-bold transition-colors ${p.isActive ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"
                                            }`}
                                    >
                                        {processingId === p.id ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : p.isActive ? (
                                            <ToggleRight size={24} />
                                        ) : (
                                            <ToggleLeft size={24} />
                                        )}
                                        <span>{p.isActive ? "Disable" : "Enable"}</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ProductManagement;
