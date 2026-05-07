import { useState, useEffect } from "react";
import { Plus, ToggleLeft, ToggleRight, Loader2, Filter, Edit, Trash2, Package, Layers } from "lucide-react";
import { fetchWithAuth } from "../../services/apiClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const ProductManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [showModal, setShowModal] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
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
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: number) => {
        const product = products.find(p => p.id === id);
        const newStatus = !product?.isActive;
        
        // Optimistic Update
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: newStatus } : p));
        
        try {
            setProcessingId(id);
            const res = await fetchWithAuth(`/admin/products/${id}/status`, {
                method: "PATCH",
            });
            if (res.ok) {
                toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error toggling product status:", error);
            // Rollback
            setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !newStatus } : p));
            toast.error("Status update failed. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    const openCreateModal = () => {
        setEditingProductId(null);
        setNewProduct({ name: "", slug: "", description: "", basePrice: 0, categoryId: "" });
        setImageFile(null);
        setShowModal(true);
    };

    const openEditModal = (product: any) => {
        setEditingProductId(product.id);
        setNewProduct({
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            basePrice: product.basePrice,
            categoryId: product.category?.id || ""
        });
        setImageFile(null);
        setShowModal(true);
    };

    const handleDeleteProduct = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        
        try {
            setProcessingId(id);
            const res = await fetchWithAuth(`/admin/products/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
                toast.success("Product deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        } finally {
            setProcessingId(null);
        }
    };

    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            const formData = new FormData();
            const productData = {
                ...newProduct,
                basePrice: Number(newProduct.basePrice),
                categoryId: Number(newProduct.categoryId)
            };
            formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
            
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const url = editingProductId ? `/admin/products/${editingProductId}` : "/admin/products";
            const method = editingProductId ? "PUT" : "POST";

            const res = await fetchWithAuth(url, {
                method: method,
                body: formData,
            });
            
            if (res.ok) {
                toast.success(`Product ${editingProductId ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                fetchData();
            }
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Failed to save product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProducts = filterCategory === "all"
        ? products
        : products.filter(p => p.category?.id.toString() === filterCategory);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="relative">
                    <Loader2 className="animate-spin text-zinc-900" size={48} strokeWidth={1.5} />
                    <div className="absolute inset-0 blur-xl bg-zinc-200/50 animate-pulse"></div>
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Loading Fleet Data</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-100">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-xl shadow-zinc-200">
                        <Package size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Product Fleet</h1>
                        <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mt-0.5">Manage {products.length} Items across your catalog</p>
                    </div>
                </div>
                
                <Dialog open={showModal} onOpenChange={(open) => {
                    if (!open) {
                        setEditingProductId(null);
                        setNewProduct({ name: "", slug: "", description: "", basePrice: 0, categoryId: "" });
                    }
                    setShowModal(open);
                }}>
                    <DialogTrigger
                        render={
                            <button onClick={openCreateModal} className="flex items-center gap-2.5 px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-black transition-all shadow-xl shadow-zinc-900/10 cursor-pointer active:scale-95">
                                <Plus size={18} strokeWidth={2.5} />
                                <span>Create New Product</span>
                            </button>
                        }
                    />
                    <DialogContent className="sm:max-w-lg rounded-[2rem] bg-white p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight mb-6">
                                {editingProductId ? "Refine Product" : "Launch Product"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmitProduct} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest px-1">Display Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-3.5 text-sm font-semibold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all outline-none"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="e.g. Matte Business Cards"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest px-1">URI Slug</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-3.5 text-sm font-semibold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all outline-none"
                                        value={newProduct.slug}
                                        onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                                        placeholder="matte-business-cards"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest px-1">Category Classification</label>
                                <select
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-3.5 text-sm font-semibold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all outline-none cursor-pointer"
                                    value={newProduct.categoryId}
                                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest px-1">Starting Price (INR)</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold text-sm">₹</span>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-10 pr-5 py-3.5 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all outline-none"
                                        value={newProduct.basePrice}
                                        onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest px-1">Description Brief</label>
                                <textarea
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-3.5 text-sm font-semibold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all outline-none h-28 resize-none"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Briefly describe the product's premium features..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest px-1">Asset Upload</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full bg-white border-2 border-dashed border-zinc-100 hover:border-zinc-300 rounded-2xl px-5 py-8 text-sm font-semibold focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-900 file:text-white hover:file:bg-black cursor-pointer text-zinc-400"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-zinc-500 bg-zinc-50 hover:bg-zinc-100 transition-all active:scale-95"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-white bg-zinc-900 hover:bg-black transition-all shadow-xl shadow-zinc-900/10 active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : (editingProductId ? "Apply Sync" : "Deploy Product")}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter & Stats Bar */}
            <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-zinc-200/20 border border-zinc-100 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">
                        <Filter size={16} className="text-zinc-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Filter By</span>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-transparent text-sm font-bold text-zinc-900 focus:outline-none cursor-pointer pr-4"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="h-10 w-px bg-zinc-100 hidden md:block"></div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400">
                        <Layers size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest leading-none mb-1">Catalog Density</p>
                        <p className="text-sm font-bold text-zinc-900 tracking-tight leading-none">{filteredProducts.length} <span className="text-xs text-zinc-400 uppercase">Items</span></p>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-zinc-200/20 border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Product Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm">
                                               {p.imageUrl ? (
                                                   <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                               ) : (
                                                   <Package size={18} strokeWidth={1.5} />
                                               )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900 tracking-tight">{p.name}</p>
                                                <p className="text-xs font-medium text-zinc-400 font-mono">/{p.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-white border border-zinc-100 text-zinc-600 rounded-lg text-[11px] font-bold uppercase tracking-widest shadow-sm">
                                            {p.category?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-xs font-medium text-zinc-400">₹</span>
                                            <span className="text-sm font-bold text-zinc-900 tracking-tight">{p.basePrice.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div 
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                                                p.isActive 
                                                ? "bg-green-50 text-green-600 border border-green-100 shadow-sm" 
                                                : "bg-red-50 text-red-600 border border-red-100 shadow-sm"
                                            }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${p.isActive ? "bg-green-600" : "bg-red-600"}`}></div>
                                            {p.isActive ? "Live" : "Offline"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-all">
                                            <button
                                                disabled={processingId === p.id}
                                                onClick={() => handleToggleStatus(p.id)}
                                                className={`p-2 rounded-xl transition-all active:scale-90 ${
                                                    p.isActive 
                                                    ? "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white" 
                                                    : "bg-zinc-100 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                                }`}
                                                title={p.isActive ? "Set Offline" : "Set Live"}
                                            >
                                                {processingId === p.id ? <Loader2 className="animate-spin" size={16} /> : (p.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />)}
                                            </button>
                                            
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="p-2 bg-zinc-100 text-zinc-500 rounded-xl hover:bg-zinc-900 hover:text-white transition-all active:scale-90"
                                                title="Edit Product"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            
                                            <button
                                                disabled={processingId === p.id}
                                                onClick={() => handleDeleteProduct(p.id)}
                                                className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-90"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                            <Layers size={32} strokeWidth={1} />
                        </div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">No products detected in this classification</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
