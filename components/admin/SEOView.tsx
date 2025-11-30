import React, { useState, useEffect } from 'react';
import { Save, Loader2, Globe } from 'lucide-react';
import { getSiteSettings, updateSiteSetting } from '../../services/apiService';
import { SiteSetting } from '../../services/supabase';

const SEOView: React.FC = () => {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await getSiteSettings();
            // Filter for SEO related settings
            const seoSettings = data.filter(s => s.key.startsWith('home_meta_'));
            setSettings(seoSettings);
        } catch (error) {
            console.error('Error fetching SEO settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = (key: string, field: 'value_en' | 'value_ar', value: string) => {
        const newSettings = settings.map(s =>
            s.key === key ? { ...s, [field]: value } : s
        );
        setSettings(newSettings);
    };

    const saveSettings = async () => {
        try {
            setSaving(true);
            await Promise.all(settings.map(setting =>
                updateSiteSetting(setting.key, {
                    value_en: setting.value_en,
                    value_ar: setting.value_ar
                })
            ));
            alert('SEO settings saved successfully!');
        } catch (error) {
            console.error('Error saving SEO settings:', error);
            alert('Error saving SEO settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">SEO Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage global SEO settings for your website</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-teal-600" />
                        Home Page Meta Tags
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">These settings control how your home page appears in search engines and social media.</p>
                </div>

                <div className="p-6 space-y-8">
                    {/* Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Meta Title (English)
                            </label>
                            <input
                                type="text"
                                value={settings.find(s => s.key === 'home_meta_title')?.value_en || ''}
                                onChange={(e) => handleUpdate('home_meta_title', 'value_en', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="e.g. Home Service Kuwait - Smart Home Experts"
                            />
                        </div>
                        <div dir="rtl">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                عنوان الميتا (Arabic)
                            </label>
                            <input
                                type="text"
                                value={settings.find(s => s.key === 'home_meta_title')?.value_ar || ''}
                                onChange={(e) => handleUpdate('home_meta_title', 'value_ar', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="مثال: خدمة المنزل الكويت - خبراء المنزل الذكي"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Meta Description (English)
                            </label>
                            <textarea
                                rows={4}
                                value={settings.find(s => s.key === 'home_meta_description')?.value_en || ''}
                                onChange={(e) => handleUpdate('home_meta_description', 'value_en', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="Brief description of your website..."
                            />
                        </div>
                        <div dir="rtl">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                وصف الميتا (Arabic)
                            </label>
                            <textarea
                                rows={4}
                                value={settings.find(s => s.key === 'home_meta_description')?.value_ar || ''}
                                onChange={(e) => handleUpdate('home_meta_description', 'value_ar', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="وصف مختصر للموقع..."
                            />
                        </div>
                    </div>

                    {/* Keywords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Meta Keywords (English)
                            </label>
                            <input
                                type="text"
                                value={settings.find(s => s.key === 'home_meta_keywords')?.value_en || ''}
                                onChange={(e) => handleUpdate('home_meta_keywords', 'value_en', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="keyword1, keyword2, keyword3"
                            />
                            <p className="text-xs text-slate-500 mt-1">Separate keywords with commas</p>
                        </div>
                        <div dir="rtl">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                كلمات مفتاحية (Arabic)
                            </label>
                            <input
                                type="text"
                                value={settings.find(s => s.key === 'home_meta_keywords')?.value_ar || ''}
                                onChange={(e) => handleUpdate('home_meta_keywords', 'value_ar', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder="كلمة1, كلمة2, كلمة3"
                            />
                            <p className="text-xs text-slate-500 mt-1">افصل بين الكلمات بفاصلة</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SEOView;
