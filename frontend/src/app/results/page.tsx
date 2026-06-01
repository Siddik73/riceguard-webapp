'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldAlert, Sparkles, CheckCircle2, RefreshCw, 
  Share2, Save, Stethoscope, ShieldCheck, ChevronDown 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScanResult {
  id: string;
  disease: string;
  nameBn: string;
  confidence: number;
  severity: string;
  imagePath: string;
  fieldName: string;
  createdAt: string;
}

interface DiseaseDetails {
  slug: string;
  name: string;
  nameBn: string;
  scientificName: string;
  severity: string;
  description: string;
  descriptionBn: string;
  symptoms: string[];
  symptomsBn: string[];
  treatment: string[];
  treatmentBn: string[];
  prevention: string[];
  preventionBn: string[];
}

export default function DiagnosisResult() {
  const router = useRouter();
  const { language, t } = useLanguage();
  
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [details, setDetails] = useState<DiseaseDetails | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<'treatment' | 'prevention' | null>('treatment');

  useEffect(() => {
    const rawResult = localStorage.getItem('temp_scan_result');
    const imageSrc = localStorage.getItem('temp_scan_image');

    if (!rawResult) {
      router.replace('/');
      return;
    }

    const scanData: ScanResult = JSON.parse(rawResult);
    setScan(scanData);
    setLocalImage(imageSrc);

    // If diagnosed healthy, celebrate with confetti!
    if (scanData.disease.toLowerCase().includes('healthy')) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2D6A4F', '#74C69D', '#F8FAF5']
      });
    }

    // Fetch full disease library details from database by slug
    const fetchDetails = async () => {
      try {
        const slug = scanData.disease.toLowerCase().replace(/\s+/g, '');
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Match slugs
        let querySlug = 'healthy';
        if (slug.includes('blast')) querySlug = 'blast';
        else if (slug.includes('blight')) querySlug = 'blight';
        else if (slug.includes('tungro')) querySlug = 'tungro';
        else if (slug.includes('brown')) querySlug = 'brownspot';
        else if (slug.includes('sheath')) querySlug = 'sheathblight';
        else if (slug.includes('smut')) querySlug = 'falsesmut';

        const res = await fetch(`${backendUrl}/api/library/${querySlug}`);
        if (res.ok) {
          const body = await res.json();
          setDetails(body.data);
        }
      } catch (err) {
        console.error('Failed to load disease library details:', err);
      }
    };

    fetchDetails();
  }, [router]);

  const handleRescan = () => {
    // Clear temp result and return home
    localStorage.removeItem('temp_scan_result');
    localStorage.removeItem('temp_scan_image');
    localStorage.removeItem('temp_scan_fileName');
    localStorage.removeItem('temp_scan_fileSize');
    router.push('/');
  };

  const handleShare = () => {
    if (navigator.share && scan) {
      navigator.share({
        title: `RiceGuard Diagnosis: ${t(scan.disease, scan.nameBn)}`,
        text: `My rice leaf was scanned by RiceGuard AI and diagnosed with ${t(scan.disease, scan.nameBn)} (${Math.round(scan.confidence * 100)}% match).`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(t('Share features are available on native mobile browsers.', 'শেয়ার ফিচারটি আপনার মোবাইল ব্রাউজারে সচল রয়েছে।'));
    }
  };

  if (!scan) return null;

  const displayDiseaseName = t(scan.disease, scan.nameBn);
  const confidencePercent = Math.round(scan.confidence * 100);
  const isHealthy = scan.disease.toLowerCase().includes('healthy');

  // Severity configurations
  const getSeverityConfig = (severityStr: string) => {
    const s = severityStr.toUpperCase();
    if (s === 'HIGH') {
      return {
        bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
        label: t('HIGH SEVERITY', 'উচ্চ তীব্রতা'),
      };
    } else if (s === 'MEDIUM') {
      return {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
        label: t('MEDIUM SEVERITY', 'মাঝারি তীব্রতা'),
      };
    } else {
      return {
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
        label: t('LOW SEVERITY', 'স্বল্প তীব্রতা'),
      };
    }
  };

  const severityConfig = getSeverityConfig(scan.severity);

  return (
    <div className="space-y-6 pb-12 select-none">
      
      {/* Top back actions */}
      <div className="px-margin-mobile flex justify-between items-center py-2">
        <button
          onClick={handleRescan}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-surface-container-high/40 text-primary font-bold text-label-sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{t('Rescan', 'পুনরায় স্ক্যান')}</span>
        </button>
        <span className="text-caption font-bold text-on-surface-variant/80">
          {scan.fieldName}
        </span>
      </div>

      {/* Diagnostic scanning view with glowing lasers */}
      <section className="relative w-full aspect-square md:rounded-2xl overflow-hidden bg-zinc-950 shadow-md">
        
        {/* Leaf image */}
        {localImage ? (
          <img
            src={localImage}
            alt="Analyzed leaf diagnostic"
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
            <Sparkles className="h-20 w-20" />
          </div>
        )}

        {/* Heatmap overlay (if infected) */}
        {!isHealthy && <div className="absolute inset-0 heatmap-overlay animate-pulse" />}

        {/* Downward scanning green laser line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-primary-fixed/80 shadow-[0_0_15px_rgba(116,198,157,0.9)] animate-scan z-10" />
      </section>

      {/* Results dashboard card */}
      <section className="px-margin-mobile -mt-10 relative z-20">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-5 border border-outline-variant/30 dark:border-zinc-800 space-y-6">
          
          {/* Diagnostic results header and circular match indicator */}
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-on-surface leading-tight tracking-tight">
                {displayDiseaseName}
              </h2>
              {details && (
                <p className="text-[12px] font-bold text-on-surface-variant/70 italic">
                  {details.scientificName}
                </p>
              )}
              
              <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${severityConfig.bg}`}>
                <ShieldAlert className="h-4.5 w-4.5" />
                <span>{severityConfig.label}</span>
              </div>
            </div>

            {/* Circular match gauge */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 rounded-full flex items-center justify-center relative select-none">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    className="text-outline-variant/30"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <circle
                    className="text-primary transition-all duration-1000"
                    cx="32"
                    cy="32"
                    fill="transparent"
                    r="28"
                    stroke="currentColor"
                    strokeDasharray="176"
                    strokeDashoffset={176 - (scan.confidence * 176)}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute text-label-sm font-extrabold text-primary">{confidencePercent}%</span>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant/80 mt-1 uppercase tracking-wider">
                {t('Match', 'মিল')}
              </span>
            </div>
          </div>

          {/* Description banner */}
          {details && (
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {t(details.description, details.descriptionBn)}
            </p>
          )}

          {/* Operations grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/20">
            <button
              onClick={() => alert(t('Scan saved to cloud dashboard!', 'স্ক্যানটি আপনার ইতিহাসে সংরক্ষণ করা হয়েছে!'))}
              className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-surface-container-low dark:bg-zinc-800 text-primary hover:bg-surface-container-high/40 select-none active:scale-95 duration-100"
            >
              <Save className="h-5 w-5" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">{t('Save', 'সংরক্ষণ')}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-surface-container-low dark:bg-zinc-800 text-primary hover:bg-surface-container-high/40 select-none active:scale-95 duration-100"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">{t('Share', 'শেয়ার')}</span>
            </button>
            <button
              onClick={handleRescan}
              className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-primary text-on-primary select-none active:scale-95 duration-100 shadow-sm"
            >
              <RefreshCw className="h-5 w-5" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">{t('Rescan', 'পুনরায়')}</span>
            </button>
          </div>

          {/* Expandable Tabs (Accordion Actions) */}
          {details && (
            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
              
              {/* Treatment Actions */}
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest dark:bg-zinc-950">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'treatment' ? null : 'treatment')}
                  className="w-full flex items-center justify-between p-4 font-bold text-body-lg text-primary hover:bg-surface-container-low/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Stethoscope className="h-5 w-5" />
                    <span>{t('Treatment Actions', 'চিকিৎসা ও দমন পরামর্শ')}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${activeAccordion === 'treatment' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeAccordion === 'treatment' && (
                  <div className="px-5 pb-5 pt-1 text-body-md text-on-surface-variant space-y-3 animate-in slide-in-from-top duration-300">
                    {(language === 'EN' ? details.treatment : details.treatmentBn).map((t, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-primary font-extrabold select-none">•</span>
                        <p className="leading-relaxed">{t}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prevention Tips */}
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest dark:bg-zinc-950">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'prevention' ? null : 'prevention')}
                  className="w-full flex items-center justify-between p-4 font-bold text-body-lg text-primary hover:bg-surface-container-low/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5" />
                    <span>{t('Prevention Tips', 'প্রতিরোধমূলক ব্যবস্থা')}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${activeAccordion === 'prevention' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeAccordion === 'prevention' && (
                  <div className="px-5 pb-5 pt-1 text-body-md text-on-surface-variant space-y-3 animate-in slide-in-from-top duration-300">
                    {(language === 'EN' ? details.prevention : details.preventionBn).map((t, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-primary font-extrabold select-none">•</span>
                        <p className="leading-relaxed">{t}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Expert confirmation disclaimer banner */}
          <div className="mt-4 p-4 rounded-xl bg-surface-container dark:bg-zinc-800 border-l-4 border-primary/20 text-center">
            <p className="text-caption text-on-surface-variant italic font-medium leading-normal">
              {t(
                '"AI predictions are helper guides. We recommend checking with local agricultural extension officers for crop verification."',
                '"এই এআই বিশ্লেষণটি একটি সহায়ক নির্দেশিকা মাত্র। চূড়ান্ত সিদ্ধান্ত নেওয়ার পূর্বে আপনার নিকটস্থ উপ-সহকারী কৃষি কর্মকর্তার পরামর্শ নিন।"'
              )}
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
