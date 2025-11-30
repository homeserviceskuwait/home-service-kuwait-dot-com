import React from 'react';
import { Product } from '../services/supabase';
import { useLanguage } from '../LanguageContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { language, isRTL } = useLanguage();
    const { addToCart } = useCart();

    const title = language === 'ar' ? product.title_ar : product.title_en;
    const price = product.price;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 transition-all duration-300 group">
            <Link to={`/shop/${product.id}`} className="block relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Image
                    </div>
                )}
            </Link>
            <div className="p-4">
                <Link to={`/shop/${product.id}`}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        {title}
                    </h3>
                </Link>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">
                        {price.toFixed(3)} KWD
                    </span>
                    <button
                        onClick={() => addToCart(product)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 transition-colors"
                        title={language === 'en' ? 'Add to Cart' : 'أضف إلى السلة'}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
