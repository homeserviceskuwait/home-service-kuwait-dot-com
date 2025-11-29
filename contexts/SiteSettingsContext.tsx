import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSiteSettings } from '../services/apiService';
import { SiteSetting } from '../services/supabase';
import { useLanguage } from '../LanguageContext';

interface SiteSettingsContextType {
    settings: Record<string, string>;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language } = useLanguage();
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const data = await getSiteSettings();
            const settingsObj = data.reduce((acc, setting) => {
                // Get value based on current language, fallback to English, then empty string
                const value = language === 'ar'
                    ? (setting.value_ar || setting.value_en || '')
                    : (setting.value_en || '');

                acc[setting.key] = value;
                return acc;
            }, {} as Record<string, string>);

            setSettings(settingsObj);
        } catch (error) {
            console.error('Error fetching site settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [language]);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => {
    const context = useContext(SiteSettingsContext);
    if (context === undefined) {
        throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
    }
    return context;
};
