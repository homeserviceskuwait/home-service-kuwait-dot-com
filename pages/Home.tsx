import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { CONTENT, PHONE_NUMBER } from '../constants';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import * as LucideIcons from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Map from '../components/Map';

const Home: React.FC = () => {
    const { language, isRTL } = useLanguage();
    const content = CONTENT[language];
    const location = useLocation();

    // Scroll to hash on load
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    // Map icon strings to actual components for the 'Why Us' section
    const getIcon = (iconName: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    };

    return (
        <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
            <Header />

            <main>
                <Hero />

                {/* Stats Section */}
                <div className="container mx-auto px-4 -mt-10 relative z-20">
                    <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-900/10 dark:shadow-black/20 transition-colors duration-300">
                        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-slate-800 dark:divide-slate-700 md:border-x border-slate-800 dark:border-slate-700 ${isRTL ? 'divide-x-reverse md:divide-x' : 'md:divide-x'}`}>
                            {content.stats.map((stat, idx) => (
                                <div key={idx} className="px-4">
                                    <div className="text-3xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-teal-200">
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-widest">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <section id="features" className="py-12 md:py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
                            <span className="text-teal-600 dark:text-teal-400 font-extrabold tracking-widest uppercase text-xs">{content.whyUs.subtitle}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 mb-6">
                                {content.whyUs.title}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                {content.whyUs.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {content.whyUs.list.map((feature, idx) => {
                                const Icon = getIcon(feature.iconName);
                                return (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 transition-all duration-300 group border border-slate-100 dark:border-slate-800">
                                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                            <Icon className="h-6 w-6 md:h-7 md:w-7 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-12 md:py-24 bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-6">
                            <div>
                                <span className="text-teal-600 dark:text-teal-400 font-extrabold tracking-widest uppercase text-xs">{content.services.subtitle}</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3">
                                    {content.services.title}
                                </h2>
                            </div>
                            <a href={`tel:${PHONE_NUMBER}`} className="hidden md:flex items-center gap-2 font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                {content.services.cta} <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                            </a>
                        </div>

                        <div className="flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-6 md:pb-0 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 hide-scrollbar">
                            {content.services.list.map((service) => (
                                <div key={service.id} className="min-w-[85vw] md:min-w-0 snap-center">
                                    <ServiceCard service={service} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 md:mt-12 text-center md:hidden">
                            <a href={`tel:${PHONE_NUMBER}`} className="inline-flex items-center justify-center w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white shadow-sm">
                                {content.services.cta}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <Testimonials />

                {/* Blog Section */}
                <section id="blog" className="py-12 md:py-24 bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-end mb-10 md:mb-12">
                            <div>
                                <span className="text-teal-600 dark:text-teal-400 font-extrabold tracking-widest uppercase text-xs">{content.blog.subtitle}</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3">{content.blog.title}</h2>
                            </div>
                            <a href="#" className="hidden md:flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 transition-colors">
                                {content.blog.cta} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                            </a>
                        </div>
                        <div className="flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-6 md:pb-0 md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-4 md:gap-8 hide-scrollbar">
                            {content.blog.list.map((post) => (
                                <article key={post.id} className="min-w-[85vw] md:min-w-0 snap-center group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-3 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 transition-all duration-300">
                                    <div className="overflow-hidden rounded-2xl mb-5 h-56 relative">
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                        <div className={`absolute top-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-800 dark:text-white ${isRTL ? 'right-4' : 'left-4'}`}>
                                            {post.date}
                                        </div>
                                    </div>
                                    <div className="px-2 pb-4">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">{post.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                                        <span className={`inline-flex items-center text-sm font-bold text-slate-900 dark:text-white ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>
                                            {content.blog.readMore} <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section id="contact" className="py-12 md:py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
                    {/* Background decoration */}
                    <div className={`absolute top-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none ${isRTL ? 'left-0' : 'right-0'}`}></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">

                            <div className="text-white">
                                <span className="text-teal-400 font-extrabold tracking-widest uppercase text-xs">{content.contact.tagline}</span>
                                <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
                                    {content.contact.title}
                                </h2>
                                <p className="text-slate-400 text-lg mb-8 max-w-md">
                                    {content.contact.description}
                                </p>

                                <div className="space-y-6 mb-12">
                                    {content.contact.guarantees.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                                            </div>
                                            <span className="font-medium text-slate-200">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                                        <p className="text-slate-400 text-xs uppercase font-bold mb-1">{content.contact.callUs}</p>
                                        <a href={`tel:${PHONE_NUMBER}`} className="text-2xl font-bold text-white hover:text-teal-400 transition-colors">{PHONE_NUMBER}</a>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                                        <p className="text-slate-400 text-xs uppercase font-bold mb-1">{content.contact.emailUs}</p>
                                        <a href="mailto:info@homesetup.kw" className="text-xl font-bold text-white hover:text-teal-400 transition-colors">info@homesetup.kw</a>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <Map className="h-64 w-full border-0" />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl transition-colors duration-300">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{content.contact.formTitle}</h3>
                                <form className="space-y-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{content.contact.nameLabel}</label>
                                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-800 dark:text-white font-medium" placeholder="" />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{content.contact.phoneLabel}</label>
                                            <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-800 dark:text-white font-medium" placeholder="" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{content.contact.serviceLabel}</label>
                                        <div className="relative">
                                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-800 dark:text-white font-medium appearance-none">
                                                <option>{language === 'en' ? 'Select a service...' : 'اختر خدمة...'}</option>
                                                {content.services.list.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                            </select>
                                            <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`}>
                                                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{content.contact.messageLabel}</label>
                                        <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-800 dark:text-white font-medium resize-none" placeholder=""></textarea>
                                    </div>

                                    <button type="button" className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98]">
                                        {content.contact.submitBtn}
                                    </button>

                                    <p className="text-center text-xs text-slate-400 mt-4">
                                        {content.contact.disclaimer}
                                    </p>
                                </form>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;