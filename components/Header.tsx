import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, ChevronRight, Globe, Moon, Sun, ChevronDown, ShoppingCart } from 'lucide-react';
import { PHONE_NUMBER, CONTENT } from '../constants';
import { useLanguage } from '../LanguageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useCart } from '../contexts/CartContext';
import Logo from './Logo';
import AppName from './AppName';
import { Link } from 'react-router-dom';
import { getServices } from '../services/apiService';
import { Service } from '../services/supabase';

const Header: React.FC = () => {
  const { language, setLanguage, isRTL, theme, toggleTheme } = useLanguage();
  const { settings } = useSiteSettings();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Separate states for desktop and mobile dropdowns
  const [isDesktopServicesOpen, setIsDesktopServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDesktopServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Fetch services for dropdown
    const fetchServices = async () => {
      try {
        const data = await getServices(language, true);
        setServices(data);
      } catch (error) {
        console.error('Error fetching services for header:', error);
      }
    };
    fetchServices();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [language]);

  const content = CONTENT[language];

  const navLinks = [
    { name: content.nav.home, href: '/' },
    { name: content.nav.services, href: '/#services', isDropdown: true },
    { name: language === 'en' ? 'Shop' : 'المتجر', href: '/shop' },
    { name: content.nav.whyUs, href: '/#features' },
    { name: content.nav.blog, href: '/blog' },
    { name: content.nav.contact, href: '/#contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <Logo className="h-10 w-10 md:h-12 md:w-12" />
              <div className="flex flex-col justify-center">
                <AppName className={`text-xl font-bold tracking-tight leading-none ${scrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`} />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/20 dark:border-slate-700/50 shadow-sm ml-4 mr-4">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.href} className="relative" ref={link.isDropdown ? dropdownRef : null}>
                    {link.isDropdown ? (
                      <button
                        onClick={() => setIsDesktopServicesOpen(!isDesktopServicesOpen)}
                        className="flex items-center gap-1 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all duration-200"
                      >
                        {link.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isDesktopServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all duration-200 block"
                      >
                        {link.name}
                      </Link>
                    )}

                    {/* Dropdown Menu */}
                    {link.isDropdown && isDesktopServicesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-2 animate-fade-in-up">
                        {services.length > 0 ? (
                          services.map((service) => (
                            <Link
                              key={service.id}
                              to={`/services/${service.id}`}
                              onClick={() => setIsDesktopServicesOpen(false)}
                              className="block px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                            >
                              {language === 'en' ? service.title_en : service.title_ar}
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-slate-400 text-center">
                            {language === 'en' ? 'Loading...' : 'جاري التحميل...'}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'العربية' : 'English'}
              </button>

              {/* CTA Button */}
              <a
                href={`tel:${settings.phone_number || PHONE_NUMBER}`}
                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-teal-600 dark:hover:bg-teal-400 dark:hover:text-slate-900 transition-all duration-300 shadow-lg shadow-slate-900/20 dark:shadow-white/10 hover:shadow-teal-600/30 transform hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                <span>{settings.phone_number || PHONE_NUMBER}</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/cart"
                className="relative p-2 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <button
                onClick={toggleLanguage}
                className="p-2 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-bold text-sm"
              >
                {language === 'en' ? 'عربي' : 'EN'}
              </button>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div
          className={`absolute top-0 w-[85%] max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out transform ${isRTL
            ? (isMenuOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full')
            : (isMenuOpen ? 'right-0 translate-x-0' : 'right-0 -translate-x-full')
            }`}
        >
          <div className="p-6 h-full flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{content.nav.home}</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-6 w-6 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.href}>
                  {link.isDropdown ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                        className="flex items-center justify-between w-full px-4 py-4 rounded-2xl text-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                      >
                        {link.name}
                        <ChevronDown className={`h-5 w-5 transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isMobileServicesOpen && (
                        <div className="pl-4 space-y-1">
                          {services.length > 0 ? (
                            services.map((service) => (
                              <Link
                                key={service.id}
                                to={`/services/${service.id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-3 text-base text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                              >
                                {language === 'en' ? service.title_en : service.title_ar}
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-base text-slate-400">
                              {language === 'en' ? 'Loading...' : 'جاري التحميل...'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                    >
                      {link.name}
                      <ChevronRight className={`h-5 w-5 opacity-30 ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`tel:${settings.phone_number || PHONE_NUMBER}`}
                className="flex items-center justify-center gap-3 w-full bg-teal-600 text-white px-6 py-5 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95"
              >
                <Phone className="h-6 w-6" />
                {content.nav.callNow}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;