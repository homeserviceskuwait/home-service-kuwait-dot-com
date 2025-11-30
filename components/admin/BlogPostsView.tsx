import React, { useState, useEffect } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useLanguage } from '../../LanguageContext';
import { BlogPost, supabase } from '../../services/supabase';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../../services/apiService';

const BlogPostModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    post?: BlogPost | null;
    onSave: () => void;
}> = ({ isOpen, onClose, post, onSave }) => {
    const [formData, setFormData] = useState<Partial<BlogPost>>(() => {
        if (post) {
            return { ...post };
        }
        return {
            title_en: '',
            title_ar: '',
            excerpt_en: '',
            excerpt_ar: '',
            image_url: '',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            slug: '',
            is_published: true,
            sort_order: 0,
        };
    });
    const [loading, setLoading] = useState(false);

    // Update form data if post changes while modal is open (fallback)
    useEffect(() => {
        if (post) {
            setFormData({ ...post });
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
    }, [post]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submissionData = { ...formData };

            if (post?.id) {
                // If editing and slug is empty, revert to original slug to prevent accidental collision
                if (!submissionData.slug) {
                    submissionData.slug = post.slug;
                } else {
                    // Ensure slug is URL friendly if manually entered
                    submissionData.slug = submissionData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                }

                // Remove system fields that shouldn't be updated
                delete submissionData.id;
                delete submissionData.created_at;
                delete submissionData.updated_at;

                console.log('Original slug:', post.slug);
                console.log('New slug:', submissionData.slug);

                // If slug hasn't changed, remove it from update to avoid unique constraint check on itself
                if (submissionData.slug === post.slug) {
                    console.log('Slug unchanged, removing from update');
                    delete submissionData.slug;
                }

                await updateBlogPost(post.id, submissionData);
            } else {
                // Auto-generate slug if empty for NEW posts
                if (!submissionData.slug && submissionData.title_en) {
                    submissionData.slug = submissionData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                }
                await createBlogPost(submissionData as any);
            }
            onSave();
            onClose();
        } catch (error: any) {
            console.error('Error saving blog post:', error);
            if (error.code === '23505' || error.message?.includes('duplicate key')) {
                alert('This slug (URL) is already taken by another post. Please change the slug or title.');
            } else {
                alert('Error saving blog post');
            }
        } finally {
            setLoading(false);
        }
    };

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
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

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const files = Array.from(e.target.files) as File[];
        if (files.length + (formData.gallery_images?.length || 0) > 10) {
            alert('You can only upload up to 10 images in total.');
            return;
        }

        setUploadingImage(true);
        try {
            const newImages: string[] = [];

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
            alert('Error uploading gallery images');
        } finally {
            setUploadingImage(false);
        }
    };
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
        ],
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Content (EN)</label>
                                <div className="bg-white">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content_en || ''}
                                        onChange={(content) => setFormData({ ...formData, content_en: content })}
                                        modules={modules}
                                        className="h-64 mb-12"
                                    />
                                </div>
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">المحتوى (AR)</label>
                                <div className="bg-white" dir="ltr">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content_ar || ''}
                                        onChange={(content) => setFormData({ ...formData, content_ar: content })}
                                        modules={modules}
                                        className="h-64 mb-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image</label>
                            <div className="space-y-3">
                                {formData.image_url && (
                                    <div className="relative w-full h-40 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
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
                                    <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {uploadingImage ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
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

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gallery Images (Max 10)</label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                {formData.gallery_images?.map((url, index) => (
                                    <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                                        <img
                                            src={url}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                gallery_images: prev.gallery_images?.filter((_, i) => i !== index)
                                            }))}
                                            className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className={`flex flex-col items-center justify-center aspect-square bg-slate-50 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {uploadingImage ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                                    ) : (
                                        <>
                                            <Plus className="w-6 h-6 text-slate-400 mb-2" />
                                            <span className="text-xs text-slate-500">Add Images</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGalleryUpload}
                                        disabled={uploadingImage}
                                        className="hidden"
                                    />
                                </label>
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
                            disabled={loading || uploadingImage}
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

            {isModalOpen && (
                <BlogPostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    post={editingPost}
                    onSave={handleSave}
                />
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
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
                        blogs.map(b => (
                            <div key={b.id} className="p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <img src={b.image_url} className="w-12 h-12 rounded-lg object-cover bg-slate-100" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">
                                            {language === 'ar' ? b.title_ar : b.title_en}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">{b.date}</p>
                                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                                            {language === 'ar' ? b.excerpt_ar : b.excerpt_en}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => handleEdit(b)}
                                        className="px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-xs font-bold"
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

export default BlogPostsView;
