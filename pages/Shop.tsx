import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageContext';
import { Product } from '../services/supabase';
import { getProducts } from '../services/apiService';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { Filter, Search } from 'lucide-react';

const CATEGORIES = [
    'All',
    'Intercom',
    'Network Systems',
    'Pbx',
    'Smartdoor Lock',
    'Solar Panels',
    'Sound System',
    'Time Attendance',
    'Surveillance Cameras',
    'Uncategorized'
];

const ITEMS_PER_PAGE = 12;

import SEO from '../components/SEO';

const Shop: React.FC = () => {
    const { language, isRTL } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts(true);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchTerm]);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = (language === 'ar' ? product.title_ar : product.title_en).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
            <SEO
                title={language === 'en' ? 'Shop - Home Service Kuwait' : 'المتجر - خدمة المنزل الكويت'}
                description={language === 'en' ? 'Browse our collection of high-quality home service products.' : 'تصفح مجموعتنا من منتجات الخدمات المنزلية عالية الجودة.'}
            />
            <Header />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="bg-slate-50 dark:bg-slate-900 py-12 mb-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            {language === 'en' ? 'Our Shop' : 'متجرنا'}
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            {language === 'en'
                                ? 'Browse our collection of high-quality home service products.'
                                : 'تصفح مجموعتنا من منتجات الخدمات المنزلية عالية الجودة.'}
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-64 flex-shrink-0">
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 sticky top-24">
                                <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-bold text-lg">
                                    <Filter className="w-5 h-5" />
                                    {language === 'en' ? 'Categories' : 'التصنيفات'}
                                </div>
                                <div className="space-y-2">
                                    {CATEGORIES.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${selectedCategory === category
                                                ? 'bg-teal-600 text-white font-bold shadow-lg shadow-teal-600/20'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {/* Search Bar */}
                            <div className="mb-8 relative">
                                <input
                                    type="text"
                                    placeholder={language === 'en' ? 'Search products...' : 'بحث عن منتجات...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                />
                                <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 ${isRTL ? 'right-4' : 'left-4'}`} />
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 animate-pulse h-80"></div>
                                    ))}
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentProducts.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                            ) : (
                                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                                        {language === 'en' ? 'No products found.' : 'لم يتم العثور على منتجات.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Shop;
