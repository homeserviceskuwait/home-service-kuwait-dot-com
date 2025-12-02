import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Edit, Trash2, X, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { Product, supabase } from '../../services/supabase';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/apiService';
import AIGenerator from './AIGenerator';

const CATEGORIES = [
    'Intercom',
    'Network Systems',
    'Pbx',
    'Smartdoor Lock',
    'Solar Panels',
    'Sound System',
    'Time Attendance',
    'Surveillance Cameras',
    'Uncategorized'
];

const ProductsView: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        price: 0,
        category: 'Uncategorized',
        image_url: '',
        stock: 0,
        is_active: true,
        meta_title_en: '',
        meta_title_ar: '',
        meta_description_en: '',
        meta_description_ar: '',
        meta_keywords_en: '',
        meta_keywords_ar: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts(false);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            title_en: product.title_en,
            title_ar: product.title_ar,
            description_en: product.description_en,
            description_ar: product.description_ar,
            price: product.price,
            category: product.category,
            image_url: product.image_url,
            stock: product.stock,
            is_active: product.is_active,
            meta_title_en: product.meta_title_en || '',
            meta_title_ar: product.meta_title_ar || '',
            meta_description_en: product.meta_description_en || '',
            meta_description_ar: product.meta_description_ar || '',
            meta_keywords_en: product.meta_keywords_en || '',
            meta_keywords_ar: product.meta_keywords_ar || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                const updated = await updateProduct(editingProduct.id, formData);
                setProducts(products.map(p => p.id === updated.id ? updated : p));
            } else {
                const created = await createProduct(formData as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
                setProducts([created, ...products]);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `product_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploadingImage(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('service-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('service-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: data.publicUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploadingImage(false);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            title_en: '',
            title_ar: '',
            description_en: '',
            description_ar: '',
            price: 0,
            category: 'Uncategorized',
            image_url: '',
            stock: 0,
            is_active: true,
            meta_title_en: '',
            meta_title_ar: '',
            meta_description_en: '',
            meta_description_ar: '',
            meta_keywords_en: '',
            meta_keywords_ar: ''
        });
    };

    const filteredProducts = products.filter(product =>
        product.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title_ar.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Products</h2>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Image</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Title</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Category</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Price</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.title_en} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <ImageIcon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{product.title_en}</div>
                                        <div className="text-sm text-slate-500">{product.title_ar}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{product.category}</td>
                                    <td className="px-6 py-4 font-medium text-teal-600 dark:text-teal-400">
                                        {product.price.toFixed(3)} KWD
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {/* Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title (English)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title (Arabic)</label>
                                        <AIGenerator
                                            type="translation"
                                            targetLang="ar"
                                            sourceText={formData.title_en}
                                            onGenerate={(text) => setFormData(prev => ({ ...prev, title_ar: text }))}
                                            label="Translate"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title_ar}
                                        onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (KWD)</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Image</label>
                                <div className="space-y-3">
                                    {formData.image_url && (
                                        <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                            <img
                                                src={formData.image_url}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image_url: '' })}
                                                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white text-slate-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {uploadingImage ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                                            ) : (
                                                <Upload className="w-5 h-5 text-slate-400" />
                                            )}
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Or enter image URL directly"
                                        value={formData.image_url || ''}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description (English)</label>
                                        <AIGenerator
                                            type="text"
                                            prompt={`Write a compelling product description for "${formData.title_en}". Focus on features and benefits.`}
                                            onGenerate={(text) => setFormData(prev => ({ ...prev, description_en: text }))}
                                            label="Generate"
                                        />
                                    </div>
                                    <textarea
                                        rows={4}
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description (Arabic)</label>
                                        <AIGenerator
                                            type="translation"
                                            targetLang="ar"
                                            sourceText={formData.description_en}
                                            onGenerate={(text) => setFormData(prev => ({ ...prev, description_ar: text }))}
                                            label="Translate"
                                        />
                                    </div>
                                    <textarea
                                        rows={4}
                                        value={formData.description_ar}
                                        onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                                    ></textarea>
                                </div>
                            </div>



                            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">SEO Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400">English SEO</h4>
                                            <AIGenerator
                                                type="seo"
                                                targetLang="en"
                                                sourceText={formData.description_en || formData.title_en}
                                                onGenerate={(result) => setFormData(prev => ({
                                                    ...prev,
                                                    meta_title_en: result.title,
                                                    meta_description_en: result.description,
                                                    meta_keywords_en: result.keywords
                                                }))}
                                                label="Auto-Fill SEO"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title (EN)</label>
                                            <input
                                                type="text"
                                                value={formData.meta_title_en || ''}
                                                onChange={e => setFormData({ ...formData, meta_title_en: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="SEO Title"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description (EN)</label>
                                            <textarea
                                                rows={3}
                                                value={formData.meta_description_en || ''}
                                                onChange={e => setFormData({ ...formData, meta_description_en: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="SEO Description"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords (EN)</label>
                                            <input
                                                type="text"
                                                value={formData.meta_keywords_en || ''}
                                                onChange={e => setFormData({ ...formData, meta_keywords_en: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="keyword1, keyword2, keyword3"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4" dir="rtl">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Arabic SEO</h4>
                                            <AIGenerator
                                                type="seo"
                                                targetLang="ar"
                                                sourceText={formData.description_ar || formData.title_ar || formData.title_en}
                                                onGenerate={(result) => setFormData(prev => ({
                                                    ...prev,
                                                    meta_title_ar: result.title,
                                                    meta_description_ar: result.description,
                                                    meta_keywords_ar: result.keywords
                                                }))}
                                                label="Auto-Fill SEO"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">عنوان الميتا (AR)</label>
                                            <input
                                                type="text"
                                                value={formData.meta_title_ar || ''}
                                                onChange={e => setFormData({ ...formData, meta_title_ar: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="عنوان SEO"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">وصف الميتا (AR)</label>
                                            <textarea
                                                rows={3}
                                                value={formData.meta_description_ar || ''}
                                                onChange={e => setFormData({ ...formData, meta_description_ar: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="وصف SEO"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الكلمات المفتاحية (AR)</label>
                                            <input
                                                type="text"
                                                value={formData.meta_keywords_ar || ''}
                                                onChange={e => setFormData({ ...formData, meta_keywords_ar: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                                                placeholder="كلمة 1، كلمة 2، كلمة 3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500"
                                    />
                                    <span className="text-slate-700 dark:text-slate-300">Active</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploadingImage}
                                    className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-bold disabled:opacity-50"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >,
                document.body
            )}
        </div >
    );
};

export default ProductsView;
