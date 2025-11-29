import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageContext';
import { BlogPost } from '../services/supabase';
import { getBlogPosts } from '../services/apiService';

const Blog: React.FC = () => {
    const { language, isRTL } = useLanguage();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getBlogPosts();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post =>
        (language === 'ar' ? post.title_ar : post.title_en)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (language === 'ar' ? post.excerpt_ar : post.excerpt_en)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
            <Header />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="bg-slate-50 dark:bg-slate-900 py-16 mb-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            {language === 'en' ? 'Our Blog' : 'مدونتنا'}
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            {language === 'en'
                                ? 'Latest news, tips, and insights about home maintenance and services.'
                                : 'أحدث الأخبار والنصائح والرؤى حول صيانة المنزل والخدمات.'}
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4">
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-12 relative">
                        <input
                            type="text"
                            placeholder={language === 'en' ? 'Search articles...' : 'بحث في المقالات...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        />
                        <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 ${isRTL ? 'right-4' : 'left-4'}`} />
                    </div>

                    {/* Blog Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 animate-pulse">
                                    <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4"></div>
                                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map(post => (
                                <Link
                                    to={`/blog/${post.slug}`}
                                    key={post.id}
                                    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={post.image_url}
                                            alt={language === 'ar' ? post.title_ar : post.title_en}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {post.date}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                                            {language === 'ar' ? post.title_ar : post.title_en}
                                        </h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6">
                                            {language === 'ar' ? post.excerpt_ar : post.excerpt_en}
                                        </p>
                                        <span className="inline-flex items-center text-sm font-bold text-teal-600 dark:text-teal-400 group-hover:gap-2 transition-all">
                                            {language === 'en' ? 'Read Article' : 'اقرأ المقال'}
                                            <ArrowRight className={`w-4 h-4 ml-1 ${isRTL ? 'rotate-180 mr-1 ml-0' : ''}`} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                {language === 'en' ? 'No articles found matching your search.' : 'لم يتم العثور على مقالات تطابق بحثك.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
