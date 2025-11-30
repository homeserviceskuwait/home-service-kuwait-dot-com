import React from 'react';
import { ArrowRight, Phone, CheckCircle2, Camera, Fingerprint, Speaker, Lock, Wifi, Video, Server } from 'lucide-react';
import { PHONE_NUMBER, CONTENT, HERO_SERVICES_EN, HERO_SERVICES_AR } from '../constants';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Service } from '../services/supabase';

interface HeroProps {
  services?: Service[];
}

const Hero: React.FC<HeroProps> = ({ services = [] }) => {
  const { language, isRTL } = useLanguage();
  const content = CONTENT[language].hero;
  const heroServices = language === 'en' ? HERO_SERVICES_EN : HERO_SERVICES_AR;
  const navigate = useNavigate();

  const getServiceId = (serviceTitle: string) => {
    if (!services.length) return '';

    // Normalize string for comparison (remove extra spaces, lowercase)
    const normalize = (str: string) => str.toLowerCase().trim();
    const target = normalize(serviceTitle);

    const service = services.find(s => {
      const title = language === 'en' ? s.title_en : s.title_ar;
      return normalize(title) === target || normalize(title).includes(target) || target.includes(normalize(title));
    });

    return service?.id;
  };

  const handleServiceClick = (serviceTitle: string) => {
    const id = getServiceId(serviceTitle);
    if (id) {
      navigate(`/services/${id}`);
    } else {
      // Fallback to services section if no ID found
      const element = document.getElementById('services');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className={`absolute top-20 w-[500px] h-[500px] bg-teal-100/50 dark:bg-teal-900/20 rounded-full blur-[100px] opacity-60 ${isRTL ? 'left-0' : 'right-0'}`}></div>
        <div className={`absolute bottom-0 w-[400px] h-[400px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-[100px] opacity-60 ${isRTL ? 'right-0' : 'left-0'}`}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-24">

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

            <div className={`flex flex-col sm:flex-row items-center justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} gap-4 mb-8 lg:mb-16 animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:bg-teal-600 dark:hover:bg-teal-400 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-teal-600/30 transform hover:-translate-y-1"
              >
                <Phone className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {content.ctaCall}
              </a>
              <a
                href={`https://wa.me/${PHONE_NUMBER.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-green-500 hover:bg-green-600 rounded-full transition-all shadow-xl shadow-green-500/20 hover:shadow-green-600/30 transform hover:-translate-y-1"
              >
                <svg
                  className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
              >
                {content.ctaServices}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </a>
            </div>
          </div>

          {/* Visual Content - Bento Grid */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 h-full">
              {heroServices.map((service, index) => {
                // Map services to specific icons
                let Icon = CheckCircle2;
                let colorClass = "bg-teal-500";

                if (service.includes('Camera') || service.includes('CCTV') || service.includes('مراقبة')) { Icon = Camera; colorClass = "bg-blue-500"; }
                else if (service.includes('Attendance') || service.includes('بصمة')) { Icon = Fingerprint; colorClass = "bg-purple-500"; }
                else if (service.includes('Audio') || service.includes('الصوتية')) { Icon = Speaker; colorClass = "bg-amber-500"; }
                else if (service.includes('Lock') || service.includes('أقفال')) { Icon = Lock; colorClass = "bg-red-500"; }
                else if (service.includes('Exchange') || service.includes('PBX') || service.includes('بدالة')) { Icon = Phone; colorClass = "bg-cyan-500"; }
                else if (service.includes('Internet') || service.includes('الإنترنت')) { Icon = Wifi; colorClass = "bg-violet-500"; }
                else if (service.includes('Intercom') || service.includes('انتركم')) { Icon = Video; colorClass = "bg-emerald-500"; }

                // Bento Grid Logic: Make the first item span 2 columns
                const isFeatured = index === 0;
                const colSpan = isFeatured ? 'col-span-2' : 'col-span-1';
                const rowSpan = isFeatured ? 'row-span-1' : 'row-span-1';

                return (
                  <div
                    key={index}
                    onClick={() => handleServiceClick(service)}
                    className={`group relative overflow-hidden rounded-2xl ${colSpan} ${rowSpan} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${colorClass}`}></div>
                    <div className="p-4 h-full flex flex-col justify-between gap-3">
                      <div className={`w-10 h-10 rounded-lg ${colorClass} bg-opacity-10 flex items-center justify-center text-white`}>
                        <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-slate-800 dark:text-slate-100 leading-tight ${isFeatured ? 'text-lg' : 'text-sm'}`}>{service}</h3>
                      </div>
                      {isFeatured && (
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {isRTL ? 'حلول أمنية متكاملة للمنازل والشركات' : 'Integrated security solutions for homes and businesses'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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