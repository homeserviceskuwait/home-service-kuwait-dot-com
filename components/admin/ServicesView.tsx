import React, { useState, useEffect } from 'react';
import { Plus, Search, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';
import { Service, supabase } from '../../services/supabase';
import { getServices, createService, updateService, deleteService } from '../../services/apiService';

const ServiceModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    service?: Service | null;
    onSave: () => void;
}> = ({ isOpen, onClose, service, onSave }) => {
    const [formData, setFormData] = useState<Partial<Service>>({
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
        price_start_en: '',
        price_start_ar: '',
        category: '',
        image_url: '',
        icon_name: 'Wrench',
        is_active: true,
        sort_order: 0,
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (service) {
            setFormData(service);
        } else {
            setFormData({
                title_en: '',
                title_ar: '',
                description_en: '',
                description_ar: '',
                long_description_en: '',
                long_description_ar: '',
                features_en: [],
                features_ar: [],
                benefits_en: [],
                benefits_ar: [],
                gallery_images: [],
                price_start_en: '',
                price_start_ar: '',
                category: '',
                image_url: '',
                icon_name: 'Wrench',
                is_active: true,
                sort_order: 0,
            });
        }
    }, [service, isOpen]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploadingImage(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('service-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('service-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (service?.id) {
                await updateService(service.id, formData);
            } else {
                await createService(formData as any);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Error saving service');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">
                        {service ? 'Edit Service' : 'Add New Service'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* English Fields */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900 border-b pb-2">English Content</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title (EN)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title_en || ''}
                                    onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description (EN)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description_en || ''}
                                    onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Long Description (EN)</label>
                                <textarea
                                    rows={5}
                                    value={formData.long_description_en || ''}
                                    onChange={e => setFormData({ ...formData, long_description_en: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Detailed description of the service..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Features (EN) - One per line</label>
                                <textarea
                                    rows={4}
                                    value={formData.features_en?.join('\n') || ''}
                                    onChange={e => setFormData({ ...formData, features_en: e.target.value.split('\n') })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Benefits (EN) - One per line</label>
                                <textarea
                                    rows={4}
                                    value={formData.benefits_en?.join('\n') || ''}
                                    onChange={e => setFormData({ ...formData, benefits_en: e.target.value.split('\n') })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price Start (EN)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., 10 KWD"
                                    value={formData.price_start_en || ''}
                                    onChange={e => setFormData({ ...formData, price_start_en: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Arabic Fields */}
                        <div className="space-y-4" dir="rtl">
                            <h3 className="font-bold text-slate-900 border-b pb-2">Arabic Content</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">العنوان (AR)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title_ar || ''}
                                    onChange={e => setFormData({ ...formData, title_ar: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الوصف (AR)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description_ar || ''}
                                    onChange={e => setFormData({ ...formData, description_ar: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">وصف تفصيلي (AR)</label>
                                <textarea
                                    rows={5}
                                    value={formData.long_description_ar || ''}
                                    onChange={e => setFormData({ ...formData, long_description_ar: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="وصف تفصيلي للخدمة..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">المميزات (AR) - ميزة في كل سطر</label>
                                <textarea
                                    rows={4}
                                    value={formData.features_ar?.join('\n') || ''}
                                    onChange={e => setFormData({ ...formData, features_ar: e.target.value.split('\n') })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الفوائد (AR) - فائدة في كل سطر</label>
                                <textarea
                                    rows={4}
                                    value={formData.benefits_ar?.join('\n') || ''}
                                    onChange={e => setFormData({ ...formData, benefits_ar: e.target.value.split('\n') })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="فائدة 1&#10;فائدة 2&#10;فائدة 3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">السعر يبدأ من (AR)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="مثال: 10 د.ك"
                                    value={formData.price_start_ar || ''}
                                    onChange={e => setFormData({ ...formData, price_start_ar: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div className="border-t pt-6">
                        <h3 className="font-bold text-slate-900 mb-4">SEO Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-600">English SEO</h4>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title (EN)</label>
                                    <input
                                        type="text"
                                        value={formData.meta_title_en || ''}
                                        onChange={e => setFormData({ ...formData, meta_title_en: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="SEO Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description (EN)</label>
                                    <textarea
                                        rows={3}
                                        value={formData.meta_description_en || ''}
                                        onChange={e => setFormData({ ...formData, meta_description_en: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="SEO Description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords (EN)</label>
                                    <input
                                        type="text"
                                        value={formData.meta_keywords_en || ''}
                                        onChange={e => setFormData({ ...formData, meta_keywords_en: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4" dir="rtl">
                                <h4 className="text-sm font-semibold text-slate-600">Arabic SEO</h4>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">عنوان الميتا (AR)</label>
                                    <input
                                        type="text"
                                        value={formData.meta_title_ar || ''}
                                        onChange={e => setFormData({ ...formData, meta_title_ar: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="عنوان SEO"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">وصف الميتا (AR)</label>
                                    <textarea
                                        rows={3}
                                        value={formData.meta_description_ar || ''}
                                        onChange={e => setFormData({ ...formData, meta_description_ar: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="وصف SEO"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">كلمات مفتاحية (AR)</label>
                                    <input
                                        type="text"
                                        value={formData.meta_keywords_ar || ''}
                                        onChange={e => setFormData({ ...formData, meta_keywords_ar: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="كلمة1, كلمة2, كلمة3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                required
                                value={formData.category || ''}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="">Select Category</option>
                                <option value="AC Services">AC Services</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Cleaning">Cleaning</option>
                                <option value="Moving">Moving</option>
                                <option value="Painting">Painting</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Service Image</label>
                            <div className="space-y-3">
                                {formData.image_url && (
                                    <div className="relative w-full h-40 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                        <img
                                            src={formData.image_url}
                                            alt="Service preview"
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
                                    <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {uploadingImage ? (
                                            <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                                        ) : (
                                            <Upload className="w-5 h-5 text-slate-400" />
                                        )}
                                        <span className="text-sm text-slate-600">
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
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Project Gallery Images (Max 5)</label>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {formData.gallery_images?.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newGallery = [...(formData.gallery_images || [])];
                                                    newGallery.splice(idx, 1);
                                                    setFormData({ ...formData, gallery_images: newGallery });
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {(formData.gallery_images?.length || 0) < 5 && (
                                        <label className={`flex flex-col items-center justify-center aspect-square bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {uploadingImage ? (
                                                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                                            ) : (
                                                <Plus className="w-6 h-6 text-slate-400" />
                                            )}
                                            <span className="text-xs text-slate-500 mt-2">Add Image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={async (e) => {
                                                    if (!e.target.files || e.target.files.length === 0) return;

                                                    const files = Array.from(e.target.files) as File[];
                                                    const currentCount = formData.gallery_images?.length || 0;
                                                    const remainingSlots = 5 - currentCount;

                                                    if (files.length > remainingSlots) {
                                                        alert(`You can only upload ${remainingSlots} more image(s).`);
                                                        return;
                                                    }

                                                    setUploadingImage(true);
                                                    const newImages: string[] = [];

                                                    try {
                                                        for (const file of files) {
                                                            const fileExt = file.name.split('.').pop();
                                                            const fileName = `gallery_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

                                                            const { error: uploadError } = await supabase.storage
                                                                .from('service-images')
                                                                .upload(fileName, file);

                                                            if (uploadError) throw uploadError;

                                                            const { data } = supabase.storage
                                                                .from('service-images')
                                                                .getPublicUrl(fileName);

                                                            newImages.push(data.publicUrl);
                                                        }

                                                        setFormData(prev => ({
                                                            ...prev,
                                                            gallery_images: [...(prev.gallery_images || []), ...newImages]
                                                        }));
                                                    } catch (error) {
                                                        console.error('Error uploading gallery images:', error);
                                                        alert('Error uploading images');
                                                    } finally {
                                                        setUploadingImage(false);
                                                    }
                                                }}
                                                disabled={uploadingImage}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sort Order</label>
                            <input
                                type="number"
                                value={formData.sort_order || 0}
                                onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active ?? true}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Active Service</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="px-6 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ServicesView: React.FC = () => {
    const { language } = useLanguage();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await getServices(language, false);
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        fetchServices();
    };

    const filteredServices = services.filter(service =>
        (language === 'ar' ? service.title_ar : service.title_en)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (language === 'ar' ? service.description_ar : service.description_en)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Manage Services</h1>
                <button
                    onClick={handleAdd}
                    className="bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-teal-700"
                >
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={editingService}
                onSave={handleSave}
            />

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search services..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Service Name</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price Start</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse">
                                                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredServices.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            {s.image_url ? (
                                                <img src={s.image_url} className="w-10 h-10 rounded-lg object-cover bg-slate-100" alt="" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                            )}
                                            {language === 'ar' ? s.title_ar : s.title_en}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{s.category}</td>
                                        <td className="px-6 py-4 text-slate-900">{language === 'ar' ? s.price_start_ar : s.price_start_en}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(s)}
                                                className="text-teal-600 font-bold text-xs hover:underline mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Are you sure you want to delete this service?')) {
                                                        try {
                                                            await deleteService(s.id);
                                                            fetchServices();
                                                        } catch (error) {
                                                            console.error('Error deleting service:', error);
                                                            alert('Error deleting service');
                                                        }
                                                    }
                                                }}
                                                className="text-red-500 font-bold text-xs hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-100">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="p-4 animate-pulse space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredServices.map(s => (
                            <div key={s.id} className="p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    {s.image_url ? (
                                        <img src={s.image_url} className="w-12 h-12 rounded-lg object-cover bg-slate-100" alt="" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">
                                            {language === 'ar' ? s.title_ar : s.title_en}
                                        </h3>
                                        <p className="text-sm text-slate-500">{s.category}</p>
                                        <p className="text-sm font-medium text-teal-600 mt-1">
                                            {language === 'ar' ? s.price_start_ar : s.price_start_en}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => handleEdit(s)}
                                        className="px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this service?')) {
                                                try {
                                                    await deleteService(s.id);
                                                    fetchServices();
                                                } catch (error) {
                                                    console.error('Error deleting service:', error);
                                                    alert('Error deleting service');
                                                }
                                            }
                                        }}
                                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default ServicesView;
