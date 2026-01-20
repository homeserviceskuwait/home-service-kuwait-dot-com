import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const { isRTL } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[service.iconName] || LucideIcons.HelpCircle;

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl p-2 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
    >
      <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 p-6 flex flex-col h-full border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:border-transparent transition-colors overflow-hidden">

        {/* Image or Icon Header */}
        <div className="mb-6">
          {service.imageUrl ? (
            <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 relative">
              <div className="absolute inset-0 bg-teal-900/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
              <img
                src={service.imageUrl}
                alt={service.title}
                loading="lazy"
                width={400}
                height={192}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-3 right-3 z-20 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm">
                <IconComponent className="h-5 w-5" />
              </div>
            </div>
          ) : (
            <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/50 rounded-2xl flex items-center justify-center text-teal-700 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="h-7 w-7" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
          {service.title}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {service.description}
        </p>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-200/60 dark:border-slate-700/60">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {service.priceStart}
          </span>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {isRTL ? 'التفاصيل' : 'Details'} <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;