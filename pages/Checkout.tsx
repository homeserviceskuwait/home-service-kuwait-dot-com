import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../LanguageContext';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/apiService';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const Checkout: React.FC = () => {
    const { language, isRTL } = useLanguage();
    const { items, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });

    if (items.length === 0 && !orderComplete) {
        navigate('/cart');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const orderItems = items.map(item => ({
                product_id: item.product.id,
                product_title: language === 'ar' ? item.product.title_ar : item.product.title_en,
                quantity: item.quantity,
                price: item.product.price
            }));

            await createOrder({
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_address: formData.address,
                items: orderItems,
                total_amount: totalAmount,
                status: 'pending'
            });

            clearCart();
            setOrderComplete(true);
        } catch (error) {
            console.error('Error creating order:', error);
            alert(language === 'en' ? 'Error placing order. Please try again.' : 'خطأ في تقديم الطلب. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderComplete) {
        return (
            <div className={`min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
                <Header />
                <main className="pt-32 pb-16 container mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                        {language === 'en' ? 'Order Placed Successfully!' : 'تم تقديم الطلب بنجاح!'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        {language === 'en'
                            ? 'Thank you for your order. We will contact you shortly to confirm delivery.'
                            : 'شكراً لطلبك. سنتصل بك قريباً لتأكيد التوصيل.'}
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors"
                    >
                        {language === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
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
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-8 transition-colors"
                    >
                        <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                        {language === 'en' ? 'Back to Cart' : 'العودة للسلة'}
                    </button>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div>
                            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
                                {language === 'en' ? 'Checkout' : 'الدفع'}
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        {language === 'en' ? 'Delivery Address' : 'عنوان التوصيل'}
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold mb-2">{language === 'en' ? 'Payment Method' : 'طريقة الدفع'}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-teal-600"></div>
                                        <span>{language === 'en' ? 'Cash on Delivery' : 'الدفع عند الاستلام'}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting
                                        ? (language === 'en' ? 'Processing...' : 'جاري المعالجة...')
                                        : (language === 'en' ? `Place Order (${totalAmount.toFixed(3)} KWD)` : `تأكيد الطلب (${totalAmount.toFixed(3)} د.ك)`)}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 h-fit">
                            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                                {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                            </h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex justify-between items-start text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {item.quantity}x {language === 'ar' ? item.product.title_ar : item.product.title_en}
                                        </span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {(item.product.price * item.quantity).toFixed(3)} KWD
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                    <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-white">
                                        <span>{language === 'en' ? 'Total' : 'الإجمالي'}</span>
                                        <span>{totalAmount.toFixed(3)} KWD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;
