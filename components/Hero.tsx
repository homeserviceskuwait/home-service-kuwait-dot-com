import React from 'react';
import { ArrowRight, Phone, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PHONE_NUMBER, CONTENT } from '../constants';
import { useLanguage } from '../LanguageContext';

const Hero: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const content = CONTENT[language].hero;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
         <div className={`absolute top-20 w-[500px] h-[500px] bg-teal-100/50 dark:bg-teal-900/20 rounded-full blur-[100px] opacity-60 ${isRTL ? 'left-0' : 'right-0'}`}></div>
         <div className={`absolute bottom-0 w-[400px] h-[400px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-[100px] opacity-60 ${isRTL ? 'right-0' : 'left-0'}`}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Content */}
          <div className={`flex-1 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              {content.tagline}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {content.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-200">
                {content.titleLine2}
              </span>
            </h1>

            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {content.description}
            </p>

            <div className={`flex flex-col sm:flex-row items-center justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} gap-4 mb-16 animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:bg-teal-600 dark:hover:bg-teal-400 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-teal-600/30 transform hover:-translate-y-1"
              >
                <Phone className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {content.ctaCall}
              </a>
              <a
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
              >
                {content.ctaServices}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </a>
            </div>

            {/* Trust Indicators */}
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 border-t border-slate-100 dark:border-slate-800 pt-8 animate-fade-in-up ${isRTL ? 'text-right' : 'text-left'}`} style={{ animationDelay: '0.4s' }}>
                 {content.features.slice(0, 6).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                        <span>{feature}</span>
                    </div>
                 ))}
            </div>
          </div>

          {/* Visual Content */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
             <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-slate-900/50 border-8 border-white dark:border-slate-800 bg-white dark:bg-slate-900">
                <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000" 
                    alt="Smart Home Tech" 
                    className="w-full h-auto scale-105 hover:scale-100 transition-transform duration-700"
                />
                
                {/* Floating Cards */}
                <div className="absolute top-8 left-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 dark:border-slate-700/50 animate-float z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-xl">
                            <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{content.stats.secure}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{content.stats.monitoring}</p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 bg-slate-900/90 dark:bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-float z-10" style={{ animationDelay: '-3s' }}>
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500/20 p-2 rounded-xl">
                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                            <p className="font-bold text-white dark:text-slate-900 text-sm">{content.stats.fiveStar}</p>
                            <p className="text-xs text-slate-300 dark:text-slate-600">{content.stats.reviews}</p>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Decorative blob behind */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-200/40 to-indigo-200/40 dark:from-teal-900/20 dark:to-indigo-900/20 blur-3xl rounded-full"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;