import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Service } from '../services/supabase';
import { createServiceRequest } from '../services/apiService';
import { PHONE_NUMBER } from '../constants';

interface ServiceRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedService: Service | null;
    services: Service[];
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ isOpen, onClose, selectedService, services }) => {
    const { language, isRTL } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        serviceId: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (selectedService) {
            setFormData(prev => ({ ...prev, serviceId: selectedService.id }));
        }
    }, [selectedService]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        setSubmitStatus('idle');

        try {
            const serviceToSubmit = services.find(s => s.id === formData.serviceId);
            await createServiceRequest({
                customer_name: formData.name,
                customer_phone: formData.phone,
                service_id: formData.serviceId,
                service_type: serviceToSubmit ? (language === 'ar' ? serviceToSubmit.title_ar : serviceToSubmit.title_en) : 'General Inquiry',
                message: formData.message,
                status: 'pending'
            });

            setSubmitStatus('success');
            setSubmitMessage(language === 'en' ? 'Thank you! Your request has been submitted successfully.' : 'شكراً! تم إرسال طلبك بنجاح.');
            setFormData({ name: '', phone: '', serviceId: '', message: '' });

            // Close modal after success (optional delay)
            setTimeout(() => {
                onClose();
                setSubmitStatus('idle');
                setSubmitMessage('');
            }, 3000);

        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
            setSubmitMessage(language === 'en' ? 'Error submitting request. Please try again.' : 'خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {language === 'en' ? 'Request Service' : 'طلب خدمة'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {language === 'en' ? 'Fill out the form below and we will contact you shortly.' : 'املأ النموذج أدناه وسنتصل بك قريباً.'}
                        </p>
                    </div>

                    {submitStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {language === 'en' ? 'Request Sent!' : 'تم إرسال الطلب!'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                {submitMessage}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                                    {language === 'en' ? 'Your Name' : 'الاسم'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-800 dark:text-white font-medium"
                                    placeholder={language === 'en' ? 'Enter your name' : 'أدخل اسمك'}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                                    {language === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-800 dark:text-white font-medium"
                                    placeholder={language === 'en' ? 'Enter your phone number' : 'أدخل رقم هاتفك'}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                                    {language === 'en' ? 'Service' : 'الخدمة'}
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-800 dark:text-white font-medium appearance-none"
                                        required
                                    >
                                        <option value="">{language === 'en' ? 'Select a service...' : 'اختر خدمة...'}</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {language === 'ar' ? s.title_ar : s.title_en}
                                            </option>
                                        ))}
                                    </select>
                                    <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`}>
                                        <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                                    {language === 'en' ? 'Message (Optional)' : 'رسالة (اختياري)'}
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-slate-50 dark:bg-slate-800 dark:text-white font-medium resize-none"
                                    placeholder={language === 'en' ? 'Any specific details?' : 'أي تفاصيل محددة؟'}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {language === 'en' ? 'Submitting...' : 'جاري الإرسال...'}
                                    </>
                                ) : (
                                    language === 'en' ? 'Submit Request' : 'إرسال الطلب'
                                )}
                            </button>

                            {submitStatus === 'error' && (
                                <div className="text-center text-sm text-red-600 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                    {submitMessage}
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestModal;
