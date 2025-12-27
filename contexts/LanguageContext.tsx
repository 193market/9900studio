import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, workflowTranslations } from '../translations';

type Language = 'ko' | 'en' | 'ja' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  wt: (key: string) => any; // Workflow translations helper
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ko');

  useEffect(() => {
    // 브라우저 언어 감지
    const browserLang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
    
    if (browserLang.includes('ko')) {
      setLanguage('ko');
    } else if (browserLang.includes('ja')) {
      setLanguage('ja');
    } else if (browserLang.includes('vi')) {
      setLanguage('vi');
    } else {
      setLanguage('en');
    }
  }, []);

  // 중첩된 객체에서 값을 찾는 헬퍼 함수
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  };

  const t = (key: string) => {
    const text = getNestedValue(translations[language], key);
    return text || key;
  };

  const wt = (key: string) => {
    const text = getNestedValue(workflowTranslations[language], key);
    return text || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, wt }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};