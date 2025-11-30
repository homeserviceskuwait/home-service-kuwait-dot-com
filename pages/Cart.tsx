import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
    const { language, isRTL } = useLanguage();
    const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
                <Header />
                <main className="pt-32 pb-16 container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold mb-4">{language === 'en' ? 'Your Cart is Empty' : 'سلة التسوق فارغة'}</h1>
                    <p className="text-slate-500 mb-8">{language === 'en' ? 'Looks like you haven\'t added anything yet.' : 'يبدو أنك لم تضف أي شيء بعد.'}</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors"
                    >
                        {language === 'en' ? 'Start Shopping' : 'ابدأ التسوق'}
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">
                        {language === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.product.id} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl flex gap-4 items-center border border-slate-100 dark:border-slate-800">
                                    <div className="w-20 h-20 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
                                        {item.product.image_url && (
                                            <img src={item.product.image_url} alt={language === 'ar' ? item.product.title_ar : item.product.title_en} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                                            {language === 'ar' ? item.product.title_ar : item.product.title_en}
                                        </h3>
                                        <div className="text-teal-600 dark:text-teal-400 font-bold">
                                            {item.product.price.toFixed(3)} KWD
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 sticky top-24">
                                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                                    {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                                </h2>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                                        <span>{totalAmount.toFixed(3)} KWD</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <span>{language === 'en' ? 'Total' : 'الإجمالي'}</span>
                                        <span>{totalAmount.toFixed(3)} KWD</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {language === 'en' ? 'Proceed to Checkout' : 'متابعة الدفع'}
                                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
