'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { Image, ShieldAlert, Sparkles, RefreshCw, X, ArrowLeftRight } from 'lucide-react';

export default function UploadPreview() {
  const router = useRouter();
  const { t } = useLanguage();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState({ name: '', size: '' });
  const [fieldName, setFieldName] = useState('General Plot');

  useEffect(() => {
    const src = localStorage.getItem('temp_scan_image');
    const name = localStorage.getItem('temp_scan_fileName') || 'leaf_sample.jpg';
    const size = localStorage.getItem('temp_scan_fileSize') || '2.4 MB';
    
    if (!src) {
      // Redirect back home if no image is present
      router.replace('/');
      return;
    }
    
    setImageSrc(src);
    setFileDetails({ name, size });
  }, [router]);

  const handleStartAnalysis = () => {
    // Save the plot name
    localStorage.setItem('temp_scan_fieldName', fieldName);
    
    // Redirect to the processing loading screen
    router.push('/processing');
  };

  const handleCancel = () => {
    // Clear storage and go back home
    localStorage.removeItem('temp_scan_image');
    localStorage.removeItem('temp_scan_fileName');
    localStorage.removeItem('temp_scan_fileSize');
    router.replace('/');
  };

  if (!imageSrc) return null;

  return (
    <div className="flex flex-col min-h-[85vh] justify-between relative px-margin-mobile">
      
      {/* Page Title & Back */}
      <div className="flex items-center gap-3 py-4 z-10 select-none">
        <button onClick={handleCancel} className="p-2 rounded-full hover:bg-surface-container-high/40 text-primary">
          <X className="h-6 w-6" />
        </button>
        <h1 className="text-headline-md font-bold text-primary">{t('Preview Leaf', 'পাতা প্রিভিউ')}</h1>
      </div>

      {/* Main Image Grid Canvas */}
      <div className="flex-grow flex items-center justify-center py-4 z-10">
        <div className="relative w-full max-w-[340px] aspect-square bg-zinc-950 rounded-2xl overflow-hidden shadow-xl border border-outline-variant/30">
          
          {/* Main Photo */}
          <img
            src={imageSrc}
            alt="Uploaded Leaf Sample"
            className="w-full h-full object-cover opacity-90 transition-transform duration-300"
          />

          {/* Grid lines overlay for alignment */}
          <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 rounded-2xl overflow-hidden">
            {/* Horizontal lines */}
            <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white/20" />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-white/20" />
            {/* Vertical lines */}
            <div className="absolute left-1/3 top-0 w-[1px] h-full bg-white/20" />
            <div className="absolute left-2/3 top-0 w-[1px] h-full bg-white/20" />
            {/* Center target circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 border-2 border-dashed border-white/40 rounded-full" />
          </div>

          {/* Top badge */}
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold flex items-center gap-1.5 border border-white/10 uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-secondary" />
            <span>AI Align</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Sheet */}
      <section className="bg-white dark:bg-zinc-900 border border-outline-variant/30 dark:border-zinc-800 rounded-2xl shadow-xl p-5 space-y-5 z-20">
        {/* File Detail row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary-container dark:bg-on-secondary-container dark:text-secondary-container p-2.5 rounded-xl text-primary">
              <Image className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-body-lg text-on-surface truncate max-w-[160px]" title={fileDetails.name}>
                {fileDetails.name}
              </p>
              <p className="text-[12px] font-bold text-on-surface-variant/80">{fileDetails.size} • JPG Image</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm font-bold">
            {t('Ready', 'প্রস্তুত')}
          </span>
        </div>

        {/* Dynamic Field Name Selector */}
        <div className="space-y-1.5">
          <label className="text-label-sm font-bold text-on-surface-variant">
            {t('Field / Plot Location Name', 'জমির প্লটের নাম')}
          </label>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-low text-body-md focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800"
            placeholder={t('e.g. North Plot', 'যেমন: উত্তর মাঠ')}
          />
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Retake */}
          <button
            onClick={handleCancel}
            className="h-14 bg-secondary-container text-on-secondary-container dark:bg-on-secondary-container dark:text-secondary-container font-bold rounded-xl active:scale-95 transition-transform flex flex-col items-center justify-center leading-tight"
          >
            <span className="text-body-md">{t('Retake', 'আবার তুলুন')}</span>
            <span className="text-[9px] opacity-70 tracking-tight">{t('Change image', 'ছবি পরিবর্তন')}</span>
          </button>
          
          {/* Analyze */}
          <button
            onClick={handleStartAnalysis}
            className="h-14 bg-primary text-on-primary font-bold rounded-xl shadow-md active:scale-95 transition-transform flex flex-col items-center justify-center leading-tight"
          >
            <span className="text-body-md">{t('Analyse Now', 'বিশ্লেষণ করুন')}</span>
            <span className="text-[9px] opacity-70 tracking-tight">{t('Execute ML model', 'এআই মডেল চালান')}</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-on-surface-variant/80 font-bold leading-normal">
          {t('Ensure leaf lesions are centered in the grid overlay for maximum diagnosis success.', 'সর্বোচ্চ সঠিক ফলাফলের জন্য আক্রান্ত অংশটি গ্রিডের মাঝে রাখুন।')}
        </p>
      </section>
    </div>
  );
}
