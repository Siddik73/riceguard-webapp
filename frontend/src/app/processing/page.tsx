'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { Scan, Lightbulb, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ProcessingAnalysis() {
  const router = useRouter();
  const { t } = useLanguage();
  const [statusMessage, setStatusMessage] = useState(t('Preparing leaf image...', 'পাতার ছবি প্রস্তুত করা হচ্ছে...'));
  const [error, setError] = useState<string | null>(null);

  // Core status steps to rotate while waiting for API
  const steps = [
    t('Uploading leaf to cloud server...', 'সার্ভারে পাতার ছবি আপলোড করা হচ্ছে...'),
    t('Running VGG19 CNN neural network layers...', 'এআই নিউরাল নেটওয়ার্ক চালানো হচ্ছে...'),
    t('Analysing lesion geometry and colors...', 'পাতার ক্ষত ও রঙের ধরন বিশ্লেষণ করা হচ্ছে...'),
    t('Calculating diagnostic confidence metrics...', 'রোগ শনাক্তকরণের নির্ভরযোগ্যতা যাচাই করা হচ্ছে...'),
    t('Finalizing treatment guidelines...', 'প্রতিকার ও পরামর্শ তৈরি করা হচ্ছে...')
  ];

  // Farmer's wisdom tips
  const tips = [
    {
      en: '"Healthy leaves start with clean water and balanced potash fertilizer."',
      bn: '"সুস্থ ধানের পাতার জন্য প্রয়োজন পরিষ্কার পানি এবং সুষম পটাশ সার প্রয়োগ।"'
    },
    {
      en: '"Perform seed treatments with warm water to prevent fungal blast early."',
      bn: '"ছত্রাকজনিত ব্লাস্ট রোগ প্রতিরোধে বীজ বপনের পূর্বে গরম পানি দিয়ে বীজ শোধন করুন।"'
    },
    {
      en: '"Keep bund weeds clean to deny green leafhoppers a breeding ground."',
      bn: '"সবুজ পাতাফড়িংয়ের বংশবৃদ্ধি রুখতে জমির আইল সবসময় আগাছামুক্ত রাখুন।"'
    }
  ];

  const [activeTip, setActiveTip] = useState(tips[0]);

  useEffect(() => {
    // Select a random farmer tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setActiveTip(randomTip);

    // Rotate status messages every 2.2 seconds
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setStatusMessage(steps[stepIndex]);
        stepIndex++;
      }
    }, 2200);

    // Helper: Convert base64 saved in home page to File Blob for Multer upload
    const base64ToBlob = (base64Str: string) => {
      const parts = base64Str.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    };

    // Perform API upload
    const uploadAndAnalyze = async () => {
      try {
        const imageSrc = localStorage.getItem('temp_scan_image');
        const fieldName = localStorage.getItem('temp_scan_fieldName') || 'General Field';
        const fileName = localStorage.getItem('temp_scan_fileName') || 'sample.jpg';

        if (!imageSrc) {
          router.replace('/');
          return;
        }

        const imageBlob = base64ToBlob(imageSrc);
        const formData = new FormData();
        formData.append('image', imageBlob, fileName);
        formData.append('fieldName', fieldName);

        // Call backend Express API
        // Express runs on PORT 5000 in dev; in production we use relative/production URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const response = await fetch(`${backendUrl}/api/scan`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || t('Server responded with an error.', 'সার্ভার থেকে ত্রুটিপূর্ণ সাড়া পাওয়া গেছে।'));
        }

        const scanData = await response.json();
        
        // Save scan result in storage for the result dashboard
        localStorage.setItem('temp_scan_result', JSON.stringify(scanData.data));
        
        // Success redirect to results
        router.push('/results');
      } catch (err: any) {
        console.error('API Error during scan:', err);
        setError(err.message || t('Failed to connect to RiceGuard API. Check your internet connection.', 'রাইসগার্ড এপিআই সার্ভারে সংযোগ করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।'));
      }
    };

    uploadAndAnalyze();

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  const handleRetry = () => {
    setError(null);
    router.replace('/upload');
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center px-margin-mobile text-center gap-12">
      
      {/* Error state */}
      {error ? (
        <div className="max-w-md bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-error/20 shadow-lg space-y-6 animate-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
            <AlertTriangle className="h-9 w-9" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-headline-md font-bold text-error">{t('Diagnostic Failed', 'বিশ্লেষণ ব্যর্থ হয়েছে')}</h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">{error}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.replace('/')}
              className="flex-1 h-12 border border-outline rounded-xl font-bold hover:bg-surface-container-high/40 select-none transition-all active:scale-95 text-on-surface-variant"
            >
              {t('Home', 'হোম')}
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 h-12 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 select-none shadow-md hover:opacity-90 transition-all active:scale-95"
            >
              <RefreshCw className="h-4.5 w-4.5" />
              <span>{t('Retry', 'পুনরায় চেষ্টা')}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Progress loader state */
        <>
          <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
            <div className="relative w-40 h-40 flex items-center justify-center select-none">
              
              {/* Circular spinning ring */}
              <svg className="w-full h-full -rotate-90">
                <circle
                  className="text-outline-variant/30"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <circle
                  className="text-primary progress-ring-circle animate-[spin_2s_linear_infinite]"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="70"
                  stroke="currentColor"
                  strokeDasharray="440"
                  strokeDashoffset="110"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
              </svg>

              {/* Scanning center icon */}
              <div className="absolute inset-0 flex items-center justify-center text-primary animate-pulse">
                <Scan className="h-14 w-14" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-bold text-headline-md text-primary leading-tight min-h-[28px] transition-all duration-300">
                {statusMessage}
              </h2>
              <p className="text-label-md text-on-surface-variant">
                {t('Our VGG19 CNN is analyzing crop signatures...', 'আমাদের এআই ধানের পাতার লক্ষণসমূহ বিশ্লেষণ করছে...')}
              </p>
            </div>
          </div>

          {/* Farmer's Wisdom Card */}
          <section className="w-full max-w-md bg-secondary-container text-on-secondary-container p-md rounded-2xl shadow-sm border border-on-secondary-container/10 transition-all hover:scale-[1.02] duration-300">
            <div className="flex items-start gap-4 text-left">
              <div className="bg-on-secondary-container text-secondary-container p-2 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-label-md">{t("Farmer's Advice", "কৃষকের পরামর্শ")}</h3>
                <p className="text-body-md leading-relaxed">{activeTip.en}</p>
                <p className="text-body-md leading-relaxed/90 opacity-80 italic">{activeTip.bn}</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
