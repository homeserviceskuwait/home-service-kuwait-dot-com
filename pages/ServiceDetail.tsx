import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle2, MessageCircle } from 'lucide-react';
import { PHONE_NUMBER, CONTENT } from '../constants';
import { useLanguage } from '../LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getServiceById } from '../services/apiService';
import { Service } from '../services/supabase';

const ServiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { language, isRTL } = useLanguage();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const content = CONTENT[language];

    useEffect(() => {
        const fetchService = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getServiceById(id);
                setService(data);
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        {language === 'en' ? 'Service not found' : 'الخدمة غير موجودة'}
                    </h2>
                    <Link
                        to="/#services"
                        className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'en' ? 'Back to Services' : 'العودة للخدمات'}
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Localize content
    const title = language === 'ar' ? service.title_ar : service.title_en;
    const description = language === 'ar' ? service.description_ar : service.description_en;
    const longDescription = language === 'ar' ? service.long_description_ar : service.long_description_en;
    const features = language === 'ar' ? service.features_ar : service.features_en;
    const benefits = language === 'ar' ? service.benefits_ar : service.benefits_en;
    const priceStart = language === 'ar' ? service.price_start_ar : service.price_start_en;
    const gallery = service.gallery_images || [];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb / Back Link */}
                    <div className="mb-6">
                        <Link
                            to="/#services"
                            className={`inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                            <span>{language === 'en' ? 'Back to Services' : 'العودة للخدمات'}</span>
                        </Link>
                    </div>

                    {/* Hero Section */}
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 h-[500px] group">
                        <img
                            src={service.image_url}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                            <div className="max-w-4xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-300 rounded-full text-sm font-bold mb-6">
                                    {service.category}
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                    {title}
                                </h1>
                                <p className="text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed">
                                    {description}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white font-medium border border-white/10">
                                        <span className="text-teal-400 font-bold">{priceStart}</span>
                                        <span className="text-slate-400 text-sm">{language === 'en' ? 'Starting Price' : 'يبدأ من'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Highlights / Thumbnails */}
                            {features && features.length > 0 && (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {features.slice(0, 4).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Long Description */}
                            {longDescription && (
                                <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                        {language === 'en' ? 'Service Overview' : 'نظرة عامة على الخدمة'}
                                    </h2>
                                    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                        {longDescription}
                                    </div>
                                </section>
                            )}

                            {/* Project Gallery */}
                            {gallery.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                        {language === 'en' ? 'Recent Projects' : 'أحدث المشاريع'}
                                        <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                                            {gallery.length} {language === 'en' ? 'Photos' : 'صور'}
                                        </span>
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {gallery.map((img, idx) => (
                                            <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                                                <img
                                                    src={img}
                                                    alt={`Project ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar / Sticky CTA */}
                        <div className="space-y-8">
                            {/* CTA Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 sticky top-24">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {language === 'en' ? 'Ready to book?' : 'جاهز للحجز؟'}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8">
                                    {language === 'en' ? 'Contact us now for a free consultation.' : 'اتصل بنا الآن للحصول على استشارة مجانية.'}
                                </p>

                                <div className="space-y-4">
                                    <a
                                        href={`tel:${PHONE_NUMBER}`}
                                        className="flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-teal-600 dark:hover:bg-teal-400 dark:hover:text-slate-900 transition-all shadow-lg hover:-translate-y-1"
                                    >
                                        <Phone className="w-5 h-5" />
                                        {content.nav.callNow}
                                    </a>
                                    <a
                                        href={`https://wa.me/${PHONE_NUMBER.replace(/\s+/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full bg-green-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg hover:-translate-y-1"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </a>
                                </div>

                                {/* Benefits List */}
                                {benefits && benefits.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                                            {language === 'en' ? 'Why Choose Us' : 'لماذا تختارنا'}
                                        </h4>
                                        <ul className="space-y-3">
                                            {benefits.map((benefit, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ServiceDetail;
