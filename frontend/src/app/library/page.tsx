'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { Search, Info, X, BookOpen, User, Calendar, Sparkles } from 'lucide-react';

interface DiseaseProfile {
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

export default function DiseaseEncyclopedia() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [diseases, setDiseases] = useState<DiseaseProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseProfile | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'symptoms' | 'treatment' | 'prevention'>('symptoms');

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/library`);
        if (res.ok) {
          const body = await res.json();
          setDiseases(body.data);
        }
      } catch (err) {
        console.error('Failed to retrieve disease library from API:', err);
      }
    };
    fetchLibrary();
  }, []);

  // Filter diseases based on search query
  const filtered = diseases.filter((d) => {
    const query = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(query) ||
      d.nameBn.toLowerCase().includes(query) ||
      d.scientificName.toLowerCase().includes(query)
    );
  });

  const openDetails = (profile: DiseaseProfile) => {
    setSelectedDisease(profile);
    setActiveModalTab('symptoms');
    document.body.style.overflow = 'hidden';
  };

  const closeDetails = () => {
    setSelectedDisease(null);
    document.body.style.overflow = '';
  };

  const getSeverityBadge = (severityStr: string) => {
    const s = severityStr.toUpperCase();
    if (s === 'HIGH') {
      return <span className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('High', 'উচ্চ')}</span>;
    } else if (s === 'MEDIUM') {
      return <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('Medium', 'মাঝারি')}</span>;
    } else {
      return <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{t('Low', 'স্বল্প')}</span>;
    }
  };

  // Static images mapping for library visual tiles
  const imageMapping: Record<string, string> = {
    tungro: "https://images.unsplash.com/photo-1599403433550-9852f8664f3c?auto=format&fit=crop&q=80&w=400",
    blight: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=400",
    blast: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400",
    brownspot: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=400",
    sheathblight: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=400",
    falsesmut: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400",
    healthy: "https://images.unsplash.com/photo-1532083153662-ff92d0497ef0?auto=format&fit=crop&q=80&w=400"
  };

  return (
    <div className="px-margin-mobile space-y-lg pt-4 select-none pb-12">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary tracking-tight">
          {t('Disease Library', 'রোগের বিশ্বকোষ')}
        </h2>
        <p className="text-label-sm text-on-surface-variant">
          {t('Search common rice crop anomalies', '১৫টিরও বেশি ধানের রোগ ও দমন পদ্ধতি খুঁজুন')}
        </p>
      </div>

      {/* Fuzzy search input */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline h-5 w-5 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('Search disease name / scientific name...', 'রোগের নাম বা বৈজ্ঞানিক নাম দিয়ে খুঁজুন...')}
          className="w-full h-12 pl-12 pr-4 bg-white dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-xl shadow-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all text-body-md"
        />
      </div>

      {/* Bento Grid layout of card results */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((item) => {
          const imgUrl = imageMapping[item.slug] || imageMapping['healthy'];
          
          return (
            <div
              key={item.slug}
              onClick={() => openDetails(item)}
              className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex flex-col border border-outline-variant/20 dark:border-zinc-800"
            >
              {/* Card visual frame */}
              <div className="h-28 w-full overflow-hidden relative">
                <img
                  src={imgUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getSeverityBadge(item.severity)}
                </div>
              </div>
              <div className="p-3 flex flex-col gap-0.5 justify-between flex-grow">
                <h3 className="font-bold text-on-surface text-body-md leading-tight group-hover:text-primary truncate">
                  {t(item.name, item.nameBn)}
                </h3>
                <p className="text-[11px] text-on-surface-variant/80 italic font-medium leading-none truncate">
                  {item.scientificName}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide up detailed encyclopedia overlay sheet */}
      {selectedDisease && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/40 backdrop-blur-sm justify-end animate-in fade-in duration-300">
          
          {/* Modal Card frame */}
          <div className="w-full max-w-[500px] mx-auto h-[90vh] bg-surface dark:bg-zinc-900 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
            
            {/* Header section */}
            <header className="sticky top-0 w-full h-16 bg-white dark:bg-zinc-800 flex items-center justify-between px-margin-mobile border-b border-outline-variant/20 z-10">
              <button
                onClick={closeDetails}
                className="p-2 rounded-full hover:bg-surface-container-high/40 text-on-surface"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-headline-md font-bold text-primary truncate max-w-[200px]">
                {t(selectedDisease.name, selectedDisease.nameBn)}
              </h2>
              <button
                onClick={() => alert(t('Encyclopedia share created!', 'শেয়ার লিংক কপি করা হয়েছে!'))}
                className="p-2 rounded-full hover:bg-surface-container-high/40 text-on-surface"
              >
                <Sparkles className="h-5 w-5" />
              </button>
            </header>

            {/* Scrollable details contents */}
            <div className="flex-grow overflow-y-auto no-scrollbar pb-16">
              
              {/* Disease profile banner */}
              <div className="h-44 w-full overflow-hidden relative">
                <img
                  src={imageMapping[selectedDisease.slug] || imageMapping['healthy']}
                  alt="disease header"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-caption font-bold text-white border border-white/10 uppercase tracking-widest">
                  {selectedDisease.scientificName}
                </div>
              </div>

              {/* Description body */}
              <div className="p-margin-mobile space-y-6">
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {t(selectedDisease.description, selectedDisease.descriptionBn)}
                </p>

                {/* Tab layout details */}
                <div className="flex border-b border-outline-variant/30">
                  {(['symptoms', 'treatment', 'prevention'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveModalTab(tab)}
                      className={`flex-1 py-3 text-center text-label-sm font-bold border-b-2 capitalize transition-all duration-300 ${
                        activeModalTab === tab
                          ? 'border-primary text-primary'
                          : 'border-transparent text-outline hover:text-on-surface'
                      }`}
                    >
                      {tab === 'symptoms' ? t('Symptoms', 'লক্ষণ') : 
                       tab === 'treatment' ? t('Treatment', 'প্রতিকার') : 
                       t('Prevention', 'প্রতিরোধ')}
                    </button>
                  ))}
                </div>

                {/* Tab Lists */}
                <div className="space-y-3 min-h-[140px]">
                  {activeModalTab === 'symptoms' && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      {(language === 'EN' ? selectedDisease.symptoms : selectedDisease.symptomsBn).map((s, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <p className="text-body-md text-on-surface-variant leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeModalTab === 'treatment' && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      {(language === 'EN' ? selectedDisease.treatment : selectedDisease.treatmentBn).map((t, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <p className="text-body-md text-on-surface-variant leading-relaxed">{t}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeModalTab === 'prevention' && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      {(language === 'EN' ? selectedDisease.prevention : selectedDisease.preventionBn).map((p, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <p className="text-body-md text-on-surface-variant leading-relaxed">{p}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Verified Farmer Community Insights Section */}
                <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                  <h4 className="font-bold text-body-lg text-primary">{t('Verified Farmer Insights', 'কৃষকদের মতামত ও পরামর্শ')}</h4>
                  
                  <div className="bg-surface-container-low dark:bg-zinc-800 rounded-xl p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container dark:bg-on-secondary-container dark:text-secondary-container flex items-center justify-center font-bold text-body-md">
                        MK
                      </div>
                      <div>
                        <p className="font-bold text-label-sm">Mubashir K. (মুবাশ্বির)</p>
                        <p className="text-[10px] text-on-surface-variant/80 font-bold flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{t('Verified Farmer • 2 days ago', 'প্রত্যয়িত কৃষক • ২ দিন পূর্বে')}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-body-md text-on-surface-variant italic leading-relaxed">
                      {t(
                        '"Applying potash early in the season helped mitigate vector leaf blight in my field."',
                        '"মরসুমের শুরুতে সুষম পটাশ সার ব্যবহার আমার জমিতে ব্লাইট রোগ নিয়ন্ত্রণে দারুণভাবে কাজ করেছে।"'
                      )}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick scan CTA footer */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-white dark:bg-zinc-800 border-t border-outline-variant/20 flex gap-3">
              <button
                onClick={() => {
                  closeDetails();
                  router.push('/');
                }}
                className="w-full h-12 bg-primary text-on-primary rounded-xl font-bold text-body-md active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span>{t('Start Diagnostic Scan', 'ক্যামেরা স্ক্যান শুরু করুন')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
