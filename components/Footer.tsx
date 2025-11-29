import React, { useState } from 'react';
import { PHONE_NUMBER, SERVICE_AREAS, BRANDS, CONTENT } from '../constants';
import { Instagram, Facebook, MapPin, Mail, Phone, ChevronDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import Logo from './Logo';
import AppName from './AppName';

const Footer: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { settings } = useSiteSettings();
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
        className={`overflow-hidden transition-all duration-300 lg:overflow-visible lg:max-h-none lg:opacity-100 ${openSection === id ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0 lg:mb-0'
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
              {[
                { Icon: Instagram, url: settings.instagram_url },
                { Icon: Facebook, url: settings.facebook_url },
                {
                  Icon: (props: any) => (
                    <svg
                      {...props}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                    </svg>
                  ),
                  url: settings.whatsapp_url
                }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-600 dark:hover:border-teal-400 transition-all"
                >
                  {i === 2 ? (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  ) : (
                    <social.Icon className="h-5 w-5" />
                  )}
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
                <li><a href="/blog" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{navContent.blog}</a></li>
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
                  <span>{settings.address || 'Kuwait City, Kuwait'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <a href={`tel:${settings.phone_number || PHONE_NUMBER}`} className="font-medium text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400" dir="ltr">{settings.phone_number || PHONE_NUMBER}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{settings.email_address || 'info@homesetup.kw'}</span>
                </li>
              </ul>
            </MobileAccordion>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
          <div className="text-center md:text-left mb-4 md:mb-0 flex flex-col gap-1">
            <p>&copy; {new Date().getFullYear()} Home Service Kuwait. {content.rights}</p>
            <p>
              Designed and Developed by <a href="https://wa.me/8801600086773" target="_blank" rel="noopener noreferrer" className="font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">Al Mamun Sikder</a>
            </p>
          </div>
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