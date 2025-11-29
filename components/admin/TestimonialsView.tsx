import React, { useState, useEffect } from 'react';
import { Plus, X, Star } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';
import { Testimonial } from '../../services/supabase';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/apiService';

const TestimonialModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    testimonial?: Testimonial | null;
    onSave: () => void;
}> = ({ isOpen, onClose, testimonial, onSave }) => {
    const [formData, setFormData] = useState<Partial<Testimonial>>({
        name: '',
        name_ar: '',
        role: '',
        role_ar: '',
        comment: '',
        comment_ar: '',
        rating: 5,
        is_active: true,
        sort_order: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (testimonial) {
            setFormData(testimonial);
        } else {
            setFormData({
                name: '',
                name_ar: '',
                role: '',
                role_ar: '',
                comment: '',
                comment_ar: '',
                rating: 5,
                is_active: true,
                sort_order: 0,
            });
        }
    }, [testimonial, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (testimonial?.id) {
                await updateTestimonial(testimonial.id, formData);
            } else {
                await createTestimonial(formData as any);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('Error saving testimonial');
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
                        {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name (EN)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role (EN)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role || ''}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Comment (EN)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.comment || ''}
                                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Arabic Fields */}
                        <div className="space-y-4" dir="rtl">
                            <h3 className="font-bold text-slate-900 border-b pb-2">Arabic Content</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الاسم (AR)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name_ar || ''}
                                    onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الدور (AR)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role_ar || ''}
                                    onChange={e => setFormData({ ...formData, role_ar: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">التعليق (AR)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.comment_ar || ''}
                                    onChange={e => setFormData({ ...formData, comment_ar: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                required
                                value={formData.rating || 5}
                                onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
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
                                <span className="text-sm font-medium text-slate-700">Active Testimonial</span>
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
                            disabled={loading}
                            className="px-6 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Testimonial'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TestimonialsView: React.FC = () => {
    const { language } = useLanguage();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTestimonial(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        fetchTestimonials();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Manage Testimonials</h1>
                <button
                    onClick={handleAdd}
                    className="bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-teal-700"
                >
                    <Plus className="w-4 h-4" /> Add Testimonial
                </button>
            </div>

            <TestimonialModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                testimonial={editingTestimonial}
                onSave={handleSave}
            />

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Rating</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 3 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                testimonials.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{language === 'ar' ? t.name_ar : t.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{language === 'ar' ? t.role_ar : t.role}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex text-yellow-400">
                                                {Array.from({ length: t.rating }).map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(t)}
                                                className="text-teal-600 font-bold text-xs hover:underline mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Are you sure you want to delete this testimonial?')) {
                                                        try {
                                                            await deleteTestimonial(t.id);
                                                            fetchTestimonials();
                                                        } catch (error) {
                                                            console.error('Error deleting testimonial:', error);
                                                            alert('Error deleting testimonial');
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
                                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                            </div>
                        ))
                    ) : (
                        testimonials.map(t => (
                            <div key={t.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {language === 'ar' ? t.name_ar : t.name}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {language === 'ar' ? t.role_ar : t.role}
                                        </p>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this testimonial?')) {
                                                try {
                                                    await deleteTestimonial(t.id);
                                                    fetchTestimonials();
                                                } catch (error) {
                                                    console.error('Error deleting testimonial:', error);
                                                    alert('Error deleting testimonial');
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

export default TestimonialsView;
