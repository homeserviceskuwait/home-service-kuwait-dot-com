import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { getSiteSettings, updateSiteSetting } from '../../services/apiService';
import { SiteSetting } from '../../services/supabase';

const SettingsView: React.FC = () => {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await getSiteSettings();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            alert('Error fetching settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (key: string, field: 'value_en' | 'value_ar', value: string) => {
        const newSettings = settings.map(s =>
            s.key === key ? { ...s, [field]: value } : s
        );
        setSettings(newSettings);
    };

    const saveSettings = async () => {
        try {
            setSaving(true);
            // Save all settings one by one
            await Promise.all(settings.map(setting =>
                updateSiteSetting(setting.key, {
                    value_en: setting.value_en,
                    value_ar: setting.value_ar
                })
            ));
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error saving settings');
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

    const formatKey = (key: string) => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Site Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage global website settings and contact information</p>
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
                <div className="p-6 space-y-6">
                    {settings.map((setting) => (
                        <div key={setting.key} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    {formatKey(setting.key)}
                                </label>
                                <p className="text-xs text-slate-500 mb-2">Key: {setting.key}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                                    English Value
                                </label>
                                {setting.type === 'text' ? (
                                    <input
                                        type="text"
                                        value={setting.value_en || ''}
                                        onChange={(e) => handleUpdate(setting.key, 'value_en', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                ) : (
                                    <textarea
                                        value={setting.value_en || ''}
                                        onChange={(e) => handleUpdate(setting.key, 'value_en', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                                    Arabic Value
                                </label>
                                {setting.type === 'text' ? (
                                    <input
                                        type="text"
                                        dir="rtl"
                                        value={setting.value_ar || ''}
                                        onChange={(e) => handleUpdate(setting.key, 'value_ar', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                ) : (
                                    <textarea
                                        dir="rtl"
                                        value={setting.value_ar || ''}
                                        onChange={(e) => handleUpdate(setting.key, 'value_ar', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
