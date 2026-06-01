'use client';

import React from 'react';
import './globals.css';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import BottomNav from '../components/BottomNav';
import PaddyAmbient from '../components/PaddyAmbient';
import Link from 'next/link';

function LayoutShell({ children }: { children: React.ReactNode }) {
  const { language, toggleLanguage, t } = useLanguage();

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          console.log('RiceGuard PWA ServiceWorker active on scope:', reg.scope);
        }).catch((err) => {
          console.warn('RiceGuard ServiceWorker registration failed:', err);
        });
      });
    }
  }, []);

  return (
    <html lang={language === 'EN' ? 'en' : 'bn'}>
      <head>
        <title>RiceGuard - Digital Agronomy & Disease Scan</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="Progressive Web App to scan rice leaf diseases and retrieve treatment recommendations" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D6A4F" />
      </head>
      <body className="font-body bg-[#F8FAF5] text-on-surface flex flex-col min-h-screen">
        {/* Header App Bar */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16 bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
          <Link href="/" className="flex items-center gap-2 select-none active:scale-95 duration-100">
            <span className="material-symbols-outlined text-primary text-headline-md">potted_plant</span>
            <span className="text-headline-md font-bold text-primary tracking-tight">RiceGuard</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              className="px-3.5 py-1.5 border-2 border-primary/20 rounded-full text-label-sm font-bold text-primary hover:bg-primary/5 active:scale-95 duration-100 select-none"
            >
              {language === 'EN' ? 'EN/বাং' : 'বাং/EN'}
            </button>
          </div>
        </header>

        {/* Ambient Swaying Paddy Backdrop and Web Audio Synth */}
        <PaddyAmbient />

        {/* Main Application Container */}
        <main className="flex-grow pt-16 pb-24 relative z-10 w-full max-w-[720px] mx-auto">
          {children}
        </main>

        {/* Persistent Premium Bottom Tab Navigation */}
        <BottomNav lang={language} />
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LayoutShell>{children}</LayoutShell>
    </LanguageProvider>
  );
}
