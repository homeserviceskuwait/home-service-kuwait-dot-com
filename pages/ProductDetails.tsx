import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageContext';
import { Product } from '../services/supabase';
import { getProductById } from '../services/apiService';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';

import SEO from '../components/SEO';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { language, isRTL } = useLanguage();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <button onClick={() => navigate('/shop')} className="text-teal-600 hover:underline">
                    Back to Shop
                </button>
            </div>
        );
    }

    const title = language === 'ar' ? product.title_ar : product.title_en;
    const description = language === 'ar' ? product.description_ar : product.description_en;

    return (
        <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
            <SEO
                title={language === 'ar' ? (product.meta_title_ar || product.title_ar) : (product.meta_title_en || product.title_en)}
                description={language === 'ar' ? (product.meta_description_ar || product.description_ar) : (product.meta_description_en || product.description_en)}
                keywords={language === 'ar' ? product.meta_keywords_ar : product.meta_keywords_en}
                image={product.image_url}
                url={`/shop/${product.id}`}
                type="product"
                lang={language}
            />
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => navigate('/shop')}
                        className="flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-8 transition-colors"
                    >
                        <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                        {language === 'en' ? 'Back to Shop' : 'العودة للمتجر'}
                    </button>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Image */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={title}
                                    className="w-full h-full object-cover aspect-square"
                                />
                            ) : (
                                <div className="w-full aspect-square flex items-center justify-center text-slate-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-bold mb-4">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                                {title}
                            </h1>
                            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-8">
                                {product.price.toFixed(3)} KWD
                            </div>

                            <div className="prose dark:prose-invert max-w-none mb-8 text-slate-600 dark:text-slate-400">
                                <p>{description}</p>
                            </div>

                            <button
                                onClick={() => addToCart(product)}
                                className="w-full md:w-auto px-8 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {language === 'en' ? 'Add to Cart' : 'أضف إلى السلة'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
