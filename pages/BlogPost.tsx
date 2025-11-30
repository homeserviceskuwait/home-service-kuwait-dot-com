import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageContext';
import { BlogPost as BlogPostType } from '../services/supabase';
import { getBlogPosts } from '../services/apiService';

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { language, isRTL } = useLanguage();
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const allPosts = await getBlogPosts();
                const foundPost = allPosts.find(p => p.slug === slug);

                if (foundPost) {
                    setPost(foundPost);
                    // Get related posts (excluding current one)
                    setRelatedPosts(allPosts.filter(p => p.id !== foundPost.id).slice(0, 3));
                } else {
                    navigate('/blog');
                }
            } catch (error) {
                console.error('Error fetching blog post:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
            <Header />

            <main className="pt-24 pb-16">
                {/* Article Header */}
                <div className="container mx-auto px-4 mb-12">
                    <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-teal-600 mb-8 transition-colors">
                        <ArrowLeft className={`w-4 h-4 mr-2 ${isRTL ? 'rotate-180 ml-2 mr-0' : ''}`} />
                        {language === 'en' ? 'Back to Blog' : 'العودة للمدونة'}
                    </Link>

                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                <Calendar className="w-4 h-4" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4" />
                                {language === 'en' ? '5 min read' : '5 دقائق قراءة'}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-slate-900 dark:text-white">
                            {language === 'ar' ? post.title_ar : post.title_en}
                        </h1>
                    </div>

                    <div className="max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/30 relative group">
                        <img
                            src={post.image_url}
                            alt={language === 'ar' ? post.title_ar : post.title_en}
                            className="w-full h-[400px] md:h-[500px] object-cover"
                        />
                    </div>
                </div>

                {/* Article Content */}
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: language === 'ar' ? post.content_ar : post.content_en }}
                        />

                        {/* Gallery Section */}
                        {post.gallery_images && post.gallery_images.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                    {language === 'ar' ? 'معرض الصور' : 'Image Gallery'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {post.gallery_images.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                            <img
                                                src={url}
                                                alt={`Gallery image ${index + 1}`}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Share */}
                        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">
                                {language === 'en' ? 'Share this article' : 'شارك هذا المقال'}
                            </span>
                            <div className="flex gap-4">
                                <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-teal-900/30 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="bg-slate-50 dark:bg-slate-900/50 py-16 mt-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-bold mb-8 text-center text-slate-900 dark:text-white">
                                {language === 'en' ? 'Related Articles' : 'مقالات ذات صلة'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map(p => (
                                    <Link
                                        to={`/blog/${p.slug}`}
                                        key={p.id}
                                        className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all"
                                    >
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={p.image_url}
                                                alt={language === 'ar' ? p.title_ar : p.title_en}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <div className="text-xs text-slate-500 mb-2">{p.date}</div>
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors line-clamp-2">
                                                {language === 'ar' ? p.title_ar : p.title_en}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BlogPost;
