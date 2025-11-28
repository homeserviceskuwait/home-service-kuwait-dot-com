import React from 'react';
import { useLanguage } from '../LanguageContext';
import { APP_NAME_EN, APP_NAME_AR } from '../constants';

interface AppNameProps {
  className?: string;
}

const AppName: React.FC<AppNameProps> = ({ className = "" }) => {
  const { language } = useLanguage();
  
  // Logic: Split the string by space, render the last word in Teal (Green)
  const fullText = language === 'ar' ? APP_NAME_AR : APP_NAME_EN;
  const parts = fullText.split(' ');
  const lastWord = parts.pop();
  const rest = parts.join(' ');

  return (
    <span className={className}>
      {rest} <span className="text-teal-600 dark:text-teal-400">{lastWord}</span>
    </span>
  );
};

export default AppName;