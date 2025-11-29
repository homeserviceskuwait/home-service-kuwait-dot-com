import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronRight, Globe, Moon, Sun } from 'lucide-react';
import { PHONE_NUMBER, CONTENT } from '../constants';
import { useLanguage } from '../LanguageContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import Logo from './Logo';
import AppName from './AppName';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { language, setLanguage, isRTL, theme, toggleTheme } = useLanguage();
  const { settings } = useSiteSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const content = CONTENT[language];

  const navLinks = [
    { name: content.nav.home, href: '/' },
    { name: content.nav.services, href: '/#services' },
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
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all duration-200 block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden lg:flex items-center gap-2">
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
            : (isMenuOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full')
            }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{content.home}</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
                >
                  {link.name}
                  <ChevronRight className={`h-5 w-5 opacity-30 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`tel:${settings.phone_number || PHONE_NUMBER}`}
                className="flex items-center justify-center gap-3 w-full bg-teal-600 text-white px-6 py-5 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95"
              >
                <Phone className="h-6 w-6" />
                {content.callNow}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;