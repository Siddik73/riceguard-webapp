'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, History, BookOpen, MessageSquare, ArrowRight, Camera, Smartphone, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function HomeOrOnboarding() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('riceguard_onboarded');
    setIsOnboarded(saved === 'true');
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem('riceguard_onboarded', 'true');
    setIsOnboarded(true);
  };

  const handleSkipOnboarding = () => {
    handleFinishOnboarding();
  };

  // --- Carousel touch swipes for Onboarding ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      // swipe left (next)
      if (currentSlide < 2) {
        setCurrentSlide(currentSlide + 1);
      }
    } else if (diff < -50) {
      // swipe right (prev)
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  // --- Image Upload Camera Trigger ---
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        // Save image data in localStorage temporarily to pass it to preview page
        localStorage.setItem('temp_scan_image', reader.result as string);
        localStorage.setItem('temp_scan_fileName', file.name);
        localStorage.setItem('temp_scan_fileSize', `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        
        // Navigate to upload preview page
        router.push('/upload');
      };
      
      reader.readAsDataURL(file);
    }
  };

  if (isOnboarded === null) {
    return <div className="min-h-screen bg-[#F8FAF5]" />; // Loading spacer
  }

  // --- Render Onboarding Flow ---
  if (!isOnboarded) {
    const slides = [
      {
        icon: Smartphone,
        titleEn: "Identify Diseases",
        titleBn: "রোগ সনাক্ত করুন",
        descEn: "RiceGuard uses AI to detect 15+ common rice plant diseases instantly from a single photo.",
        descBn: "রাইসগার্ড এআই ব্যবহার করে একটি মাত্র ছবি থেকে ১৫টিরও বেশি সাধারণ ধানের রোগ তাৎক্ষণিকভাবে শনাক্ত করে।"
      },
      {
        icon: Camera,
        titleEn: "Take Clear Photos",
        titleBn: "স্পষ্ট ছবি তুলুন",
        descEn: "Ensure good lighting and focus directly on the affected area for high-accuracy results.",
        descBn: "সবাধিক সঠিক ফলাফলের জন্য পর্যাপ্ত আলো নিশ্চিত করুন এবং আক্রান্ত অংশের ওপর সরাসরি ফোকাস করুন।"
      },
      {
        icon: HeartHandshake,
        titleEn: "Save Your Crop",
        titleBn: "আপনার ফসল রক্ষা করুন",
        descEn: "Get expert advice and treatment recommendations to protect your yield.",
        descBn: "আপনার ফলন রক্ষা করতে তাত্ক্ষণিকভাবে বিশেষজ্ঞের পরামর্শ এবং কার্যকর প্রতিকার পান।"
      }
    ];

    return (
      <div className="flex flex-col min-h-[85vh] justify-between px-margin-mobile">
        {/* Top bar onboarding skips */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSkipOnboarding}
            className="text-label-sm font-bold text-on-surface-variant hover:bg-surface-container-high/40 px-3 py-1.5 rounded-full select-none"
          >
            {t('Skip / বাদ দিন', 'বাদ দিন / Skip')}
          </button>
        </div>

        {/* Swipeable slides */}
        <div 
          className="flex-grow flex flex-col justify-center items-center py-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-full max-w-[320px] aspect-square rounded-2xl bg-surface-container shadow-sm flex items-center justify-center mb-8 relative overflow-hidden group">
            {/* Ambient visual decorations inside slide cards */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            
            {currentSlide === 0 && (
              <div className="flex flex-col items-center gap-3 z-10 animate-bounce">
                <Leaf className="h-20 w-20 text-primary" />
                <div className="w-24 h-1 bg-primary/20 rounded-full" />
              </div>
            )}

            {currentSlide === 1 && (
              <div className="flex flex-col items-center gap-3 z-10 animate-pulse">
                <Camera className="h-20 w-20 text-secondary" />
                <div className="absolute inset-0 border-4 border-dashed border-secondary/30 m-4 rounded-xl" />
              </div>
            )}

            {currentSlide === 2 && (
              <div className="flex flex-col items-center gap-3 z-10">
                <div className="p-8 bg-primary-container text-on-primary rounded-full animate-bounce">
                  <Smartphone className="h-14 w-14" />
                </div>
              </div>
            )}
          </div>

          {/* Texts */}
          <div className="text-center max-w-sm px-4 space-y-3">
            <h1 className="text-headline-lg-mobile font-bold text-primary">
              {t(slides[currentSlide].titleEn, slides[currentSlide].titleBn)}
            </h1>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {t(slides[currentSlide].descEn, slides[currentSlide].descBn)}
            </p>
          </div>
        </div>

        {/* Footer slides navigation */}
        <div className="py-8 flex flex-col items-center gap-6">
          {/* Pagination Indicators */}
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide 
                    ? 'w-6 bg-primary-container' 
                    : 'w-2.5 bg-outline-variant/60'
                }`}
              />
            ))}
          </div>

          {/* Next/Start Action Button */}
          {currentSlide === 2 ? (
            <button
              onClick={handleFinishOnboarding}
              className="w-full max-w-xs h-14 bg-primary text-on-primary font-bold rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
              <span className="text-body-lg">{t('Start Scan / স্ক্যান শুরু করুন', 'স্ক্যান শুরু করুন / Start Scan')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentSlide(currentSlide + 1)}
              className="w-full max-w-xs h-14 bg-primary-container text-on-primary-container font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span className="text-body-lg">{t('Next', 'পরবর্তী')}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- Render Home Scanning Dashboard ---
  return (
    <div className="px-margin-mobile space-y-xl pt-4">
      {/* Hidden input for camera upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Hero Welcome banner */}
      <section className="text-center space-y-2">
        <h2 className="font-bold text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
          {t('Take a photo. Know the disease.', 'একটি ছবি নিন। রোগটি জানুন।')}
        </h2>
        <p className="font-medium text-label-md text-on-surface-variant">
          {t('Save your crop.', 'আপনার ফসল বাঁচান।')}
        </p>
      </section>

      {/* Pulsing camera scan launch area */}
      <section>
        <div
          onClick={handleCameraClick}
          className="relative pulsing-border border-4 border-dashed border-secondary rounded-2xl bg-surface-container-low aspect-square flex flex-col items-center justify-center cursor-pointer active:scale-[0.98] transition-transform duration-200 overflow-hidden shadow-sm select-none group"
        >
          {/* Subtle crop leaf silhouette backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 opacity-60 z-0" />
          
          <div className="z-10 flex flex-col items-center gap-4 text-center p-6">
            <div className="bg-primary-container p-6 rounded-full shadow-lg text-on-primary group-hover:scale-105 transition-transform duration-300">
              <Camera className="h-12 w-12" />
            </div>
            <div>
              <h3 className="font-bold text-headline-md text-primary mb-1">
                {t('Start Camera Scan', 'ক্যামেরা স্ক্যান শুরু করুন')}
              </h3>
              <p className="text-label-sm text-on-surface-variant">
                {t('Tap to snap or upload a photo', 'ছবি তুলতে বা আপলোড করতে ট্যাপ করুন')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter pb-8">
        
        {/* Scan History */}
        <Link href="/history" className="flex items-center gap-md p-md bg-white dark:bg-zinc-900 border border-outline-variant/30 dark:border-zinc-800 rounded-xl shadow-sm hover:bg-surface-container-high/40 dark:hover:bg-zinc-850 active:scale-95 duration-150 text-left">
          <div className="bg-secondary-container text-on-secondary-container dark:bg-on-secondary-container dark:text-secondary-container p-3 rounded-lg">
            <History className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-body-lg text-on-surface">{t('Scan History', 'স্ক্যান ইতিহাস')}</div>
            <div className="text-label-sm text-on-surface-variant/80">{t('Review recent diagnoses', 'আপনার পূর্বের স্ক্যানসমূহ')}</div>
          </div>
        </Link>

        {/* Disease Library */}
        <Link href="/library" className="flex items-center gap-md p-md bg-white dark:bg-zinc-900 border border-outline-variant/30 dark:border-zinc-800 rounded-xl shadow-sm hover:bg-surface-container-high/40 dark:hover:bg-zinc-850 active:scale-95 duration-150 text-left">
          <div className="bg-secondary-container text-on-secondary-container dark:bg-on-secondary-container dark:text-secondary-container p-3 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-body-lg text-on-surface">{t('Disease Library', 'রোগের লাইব্রেরি')}</div>
            <div className="text-label-sm text-on-surface-variant/80">{t('Learn about common diseases', 'ধানের রোগ ও প্রতিকার জানুন')}</div>
          </div>
        </Link>

        {/* Community Forum - Full width on mobile */}
        <div className="md:col-span-2 flex items-center gap-md p-md bg-white dark:bg-zinc-900 border border-outline-variant/30 dark:border-zinc-800 rounded-xl shadow-sm hover:bg-surface-container-high/40 dark:hover:bg-zinc-850 active:scale-95 duration-150 text-left cursor-pointer">
          <div className="bg-secondary-container text-on-secondary-container dark:bg-on-secondary-container dark:text-secondary-container p-3 rounded-lg">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-body-lg text-on-surface">{t('Community Forum', 'কমিউনিটি ফোরাম')}</div>
            <div className="text-label-sm text-on-surface-variant/80">{t('Discuss with local crop experts', 'অন্যান্য কৃষক ও বিশেষজ্ঞদের মতামত')}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
