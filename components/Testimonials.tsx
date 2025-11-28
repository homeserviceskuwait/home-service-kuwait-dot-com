import React from 'react';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { CONTENT } from '../constants';

const Testimonials: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const content = CONTENT[language].testimonials;

  return (
    <section id="reviews" className="py-12 md:py-24 bg-white dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 dark:bg-slate-900 -skew-x-12 opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-teal-600 dark:text-teal-400 font-extrabold tracking-widest uppercase text-xs">{content.subtitle}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 leading-tight">
              {content.title}
            </h2>
          </div>
          {/* Visual Stars Summary */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Rated 5.0 by 230+ Happy Customers</p>
          </div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-6 md:pb-0 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 hide-scrollbar">
          {content.list.map((testimonial) => (
            <div key={testimonial.id} className="min-w-[85vw] md:min-w-0 snap-center group relative bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 hover:-translate-y-1">
              {/* Giant Quote Mark */}
              <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} text-teal-100 dark:text-slate-800 transition-colors`}>
                <Quote className="h-12 w-12 opacity-50 transform rotate-180" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-8 flex-1 font-medium">
                  "{testimonial.comment}"
                </p>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-teal-600/20">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{testimonial.name}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-500 uppercase font-bold tracking-wider">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;