import React, { useState, useEffect } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';
import { BlogPost } from '../../services/supabase';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../../services/apiService';

const BlogPostModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    post?: BlogPost | null;
    onSave: () => void;
}> = ({ isOpen, onClose, post, onSave }) => {
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title_en: '',
        title_ar: '',
        excerpt_en: '',
        excerpt_ar: '',
        image_url: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        slug: '',
        is_published: true,
        sort_order: 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (post) {
            setFormData(post);
        } else {
            setFormData({
                title_en: '',
                title_ar: '',
                excerpt_en: '',
                excerpt_ar: '',
                image_url: '',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                slug: '',
                is_published: true,
                sort_order: 0,
            });
        }
    }, [post, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Auto-generate slug if empty
            if (!formData.slug && formData.title_en) {
                formData.slug = formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }

            if (post?.id) {
                await updateBlogPost(post.id, formData);
            } else {
                await createBlogPost(formData as any);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving blog post:', error);
            alert('Error saving blog post');
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
                        {post ? 'Edit Blog Post' : 'Add New Blog Post'}
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt (EN)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.excerpt_en || ''}
                                    onChange={e => setFormData({ ...formData, excerpt_en: e.target.value })}
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">مقتطف (AR)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.excerpt_ar || ''}
                                    onChange={e => setFormData({ ...formData, excerpt_ar: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    required
                                    value={formData.image_url || ''}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                                <a
                                    href={formData.image_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <Upload className="w-5 h-5 text-slate-600" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input
                                type="text"
                                required
                                value={formData.date || ''}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                value={formData.slug || ''}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="auto-generated-from-title"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_published ?? true}
                                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-sm font-medium text-slate-700">Published</span>
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
                            {loading ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BlogPostsView: React.FC = () => {
    const { language } = useLanguage();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const data = await getBlogPosts(false); // Fetch all, not just published
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingPost(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        fetchBlogs();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Manage Blog Posts</h1>
                <button
                    onClick={handleAdd}
                    className="bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-teal-700"
                >
                    <Plus className="w-4 h-4" /> Add Post
                </button>
            </div>

            <BlogPostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                post={editingPost}
                onSave={handleSave}
            />

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Title</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Excerpt</th>
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
                            blogs.map(b => (
                                <tr key={b.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                        <img src={b.image_url} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                        {language === 'ar' ? b.title_ar : b.title_en}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{b.date}</td>
                                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">
                                        {language === 'ar' ? b.excerpt_ar : b.excerpt_en}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(b)}
                                            className="text-teal-600 font-bold text-xs hover:underline mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Are you sure you want to delete this post?')) {
                                                    try {
                                                        await deleteBlogPost(b.id);
                                                        fetchBlogs();
                                                    } catch (error) {
                                                        console.error('Error deleting blog post:', error);
                                                        alert('Error deleting blog post');
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
        </div>
    )
}

export default BlogPostsView;
