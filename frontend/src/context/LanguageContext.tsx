'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'BN';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (en: string, bn: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('riceguard_language');
    if (saved === 'EN' || saved === 'BN') {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === 'EN' ? 'BN' : 'EN';
    setLanguage(nextLang);
    localStorage.setItem('riceguard_language', nextLang);
  };

  const t = (en: string, bn: string) => {
    return language === 'EN' ? en : bn;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
export default LanguageProvider;
