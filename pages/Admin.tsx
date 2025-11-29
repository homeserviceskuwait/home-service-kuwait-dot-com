import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Package, Plus, Search, MessageSquare, ClipboardList, X, Upload, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { CONTENT } from '../constants';
import { useLanguage } from '../LanguageContext';
import { Service, Testimonial, BlogPost, ServiceRequest } from '../services/supabase';
import { getServices, createService, updateService, deleteService, getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getServiceRequests, updateServiceRequest, deleteServiceRequest, getSiteSettings, updateSiteSetting } from '../services/apiService';
import SettingsView from '../components/admin/SettingsView';

// --- Modals ---

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

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
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
    }
  }, [service, isOpen]);

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
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div >
  );
};

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
                <label className="block text-sm font-medium text-slate-700 mb-1">الدور/الوظيفة (AR)</label>
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

const RequestDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  request?: ServiceRequest | null;
}> = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900">Request Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
            <p className="text-slate-900 font-medium">{request.customer_name}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
            <p className="text-slate-900 font-medium">{request.customer_phone}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Type</label>
            <p className="text-slate-900 font-medium">{request.service_type}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
            <p className="text-slate-900 font-medium">{new Date(request.created_at).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${request.status === 'completed' ? 'bg-green-100 text-green-700' :
              request.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                request.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
              }`}>
              {request.status.toUpperCase()}
            </span>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed">
              {request.message || 'No message provided.'}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Views ---

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6 hidden md:flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <Logo className="w-8 h-8" />
        <span className="font-bold text-lg">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-2">
        <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/dashboard') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link to="/admin/services" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/services') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <Package className="w-5 h-5" />
          Services
        </Link>
        <Link to="/admin/requests" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/requests') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <ClipboardList className="w-5 h-5" />
          Requests
        </Link>
        <Link to="/admin/blogs" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/blogs') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <FileText className="w-5 h-5" />
          Blog Posts
        </Link>
        <Link to="/admin/testimonials" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/testimonials') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <MessageSquare className="w-5 h-5" />
          Testimonials
        </Link>
        <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/settings') ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
          <Settings className="w-5 h-5" />
          Settings
        </Link>

        <div className="pt-4 mt-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5" />
            View Live Site
          </Link>
        </div>
      </nav>

      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-auto">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

const DashboardView: React.FC = () => {
  // Using mock data from constants to simulate stats
  const stats = [
    { label: 'Total Visits', value: '12,450', change: '+12%' },
    { label: 'Service Requests', value: '143', change: '+5%' },
    { label: 'Active Services', value: '28', change: '0%' },
    { label: 'Revenue (KWD)', value: '4,200', change: '+18%' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">New Service Request</p>
                  <p className="text-xs text-slate-500">From Abdullah Al-Sabah • 2 mins ago</p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-600 cursor-pointer">View</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
      const data = await getServices();
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
                    <img src={s.image_url} className="w-8 h-8 rounded-lg object-cover" alt="" />
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
    </div>
  )
}

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
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Rating</th>
              <th className="px-6 py-4 font-semibold">Comment</th>
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
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {language === 'ar' ? (t.name_ar || t.name) : t.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {language === 'ar' ? (t.role_ar || t.role) : t.role}
                  </td>
                  <td className="px-6 py-4 text-slate-900">{'★'.repeat(t.rating)}</td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-xs">
                    {language === 'ar' ? (t.comment_ar || t.comment) : t.comment}
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
    </div>
  )
}

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

const RequestsView: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getServiceRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
      </div>

      <RequestDetailsModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Service</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
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
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                  </td>
                </tr>
              ))
            ) : (
              requests.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{r.customer_name}</td>
                  <td className="px-6 py-4 text-slate-500">{r.service_type}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-900 font-bold">{r.amount || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={r.status}
                      onChange={async (e) => {
                        try {
                          await updateServiceRequest(r.id, { status: e.target.value as any });
                          fetchRequests();
                        } catch (error) {
                          console.error('Error updating request:', error);
                          alert('Error updating request');
                        }
                      }}
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(r.status)} border-none focus:ring-0 cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedRequest(r)}
                      className="text-teal-600 font-bold text-xs hover:underline mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this request?')) {
                          try {
                            await deleteServiceRequest(r.id);
                            fetchRequests();
                          } catch (error) {
                            console.error('Error deleting request:', error);
                            alert('Error deleting request');
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

const Admin: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="services" element={<ServicesView />} />
          <Route path="requests" element={<RequestsView />} />
          <Route path="blogs" element={<BlogPostsView />} />
          <Route path="testimonials" element={<TestimonialsView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="*" element={<DashboardView />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;