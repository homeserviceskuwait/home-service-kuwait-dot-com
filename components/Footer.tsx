import React, { useState } from 'react';
import { PHONE_NUMBER, SERVICE_AREAS, BRANDS, CONTENT } from '../constants';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone, ChevronDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import Logo from './Logo';
import AppName from './AppName';

const Footer: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const content = CONTENT[language].footer;
  const navContent = CONTENT[language].nav;

  // State for mobile accordion
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const MobileAccordion = ({ title, children, id }: { title: string, children: React.ReactNode, id: string }) => (
    <div className="border-b border-slate-200 dark:border-slate-800 lg:border-none">
      <button 
        onClick={() => toggleSection(id)}
        className="flex items-center justify-between w-full py-4 lg:py-0 text-left lg:cursor-default lg:pointer-events-none"
      >
        <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
        <ChevronDown 
          className={`h-4 w-4 text-slate-500 lg:hidden transition-transform duration-300 ${openSection === id ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 lg:overflow-visible lg:max-h-none lg:opacity-100 ${
          openSection === id ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 lg:mb-0'
        }`}
      >
        {children}
      </div>
    </div>
  );

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 pt-16 lg:pt-24 pb-12 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-20">
          
          {/* Brand Column (Always visible) */}
          <div className={`lg:col-span-4 space-y-6 lg:space-y-8 ${isRTL ? 'text-right' : 'text-left'} mb-8 lg:mb-0`}>
            <div className="flex items-center gap-2.5">
                <Logo className="h-10 w-10" />
                <AppName className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight" />
            </div>
            <p className={`text-slate-500 dark:text-slate-400 leading-relaxed text-sm lg:text-base ${isRTL ? 'pl-8' : 'pr-8'}`}>
              {content.about}
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-600 dark:hover:border-teal-400 transition-all">
                    <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (Collapsible on Mobile) */}
          <div className="lg:col-span-2">
            <MobileAccordion title={content.company} id="company">
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 mt-2 lg:mt-6">
                <li><a href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{navContent.home}</a></li>
                <li><a href="/#services" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{navContent.services}</a></li>
                <li><a href="/#blog" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{navContent.blog}</a></li>
                <li><a href="/#contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{navContent.contact}</a></li>
                <li><a href="/admin" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Admin Login</a></li>
              </ul>
            </MobileAccordion>
          </div>

          {/* Brands & Areas (Collapsible on Mobile) */}
          <div className="lg:col-span-3">
            <MobileAccordion title={content.popularBrands} id="brands">
               <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mt-2 lg:mt-6">
                  {BRANDS.camera.slice(0, 3).map(b => <span key={b} className="hover:text-slate-900 dark:hover:text-white cursor-default">{b}</span>)}
                  {BRANDS.intercom.slice(0, 3).map(b => <span key={b} className="hover:text-slate-900 dark:hover:text-white cursor-default">{b}</span>)}
                  {BRANDS.locks.slice(0, 2).map(b => <span key={b} className="hover:text-slate-900 dark:hover:text-white cursor-default">{b}</span>)}
               </div>
               <div className="mt-6">
                  <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">{content.serviceAreas}</h5>
                  <div className="flex flex-wrap gap-2">
                      {SERVICE_AREAS.slice(0, 5).map(area => (
                          <span key={area} className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                              {area}
                          </span>
                      ))}
                      <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">+{language === 'en' ? '4 more' : '٤ آخرين'}</span>
                  </div>
               </div>
            </MobileAccordion>
          </div>

          {/* Contact (Collapsible on Mobile) */}
          <div className="lg:col-span-3">
            <MobileAccordion title={content.getInTouch} id="contact">
              <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 mt-2 lg:mt-6">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Kuwait City, Kuwait</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <a href={`tel:${PHONE_NUMBER}`} className="font-medium text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400" dir="ltr">{PHONE_NUMBER}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>info@homesetup.kw</span>
                </li>
              </ul>
            </MobileAccordion>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
          <p className="text-center md:text-left mb-4 md:mb-0">&copy; {new Date().getFullYear()} Home Setup Kuwait. {content.rights}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">{content.privacy}</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">{content.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;