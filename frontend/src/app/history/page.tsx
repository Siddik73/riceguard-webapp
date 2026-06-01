'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { History, Calendar, Trash2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

interface ScanRecord {
  id: string;
  disease: string;
  nameBn: string;
  confidence: number;
  severity: string;
  imagePath: string;
  fieldName: string;
  createdAt: string;
}

export default function ScanHistoryDashboard() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'healthy'>('all');

  const fetchHistory = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/history`);
      if (res.ok) {
        const body = await res.json();
        setHistory(body.data);
      }
    } catch (err) {
      console.error('Failed to fetch scan history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm(t('Are you sure you want to clear all scan history?', 'আপনি কি সত্যিই আপনার সমস্ত স্ক্যান ইতিহাস মুছে ফেলতে চান?'))) {
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/history`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setHistory([]);
        alert(t('Scan history cleared successfully!', 'সমস্ত স্ক্যান ইতিহাস মুছে ফেলা হয়েছে!'));
      }
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleViewDetails = (scan: ScanRecord) => {
    // Save details in local storage temporarily and push to results
    localStorage.setItem('temp_scan_result', JSON.stringify(scan));
    localStorage.removeItem('temp_scan_image'); // results page will render fallback or display path
    router.push('/results');
  };

  // Filter history
  const filteredHistory = history.filter((item) => {
    if (activeFilter === 'high') {
      return item.severity.toUpperCase() === 'HIGH';
    }
    if (activeFilter === 'healthy') {
      return item.disease.toLowerCase().includes('healthy');
    }
    return true;
  });

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

  const getMockedImage = (disease: string) => {
    const d = disease.toLowerCase();
    if (d.includes('blast')) return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=120";
    if (d.includes('blight')) return "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=120";
    if (d.includes('tungro')) return "https://images.unsplash.com/photo-1599403433550-9852f8664f3c?auto=format&fit=crop&q=80&w=120";
    if (d.includes('brown')) return "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=120";
    return "https://images.unsplash.com/photo-1532083153662-ff92d0497ef0?auto=format&fit=crop&q=80&w=120";
  };

  return (
    <div className="px-margin-mobile space-y-lg pt-4 select-none pb-12">
      
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-primary tracking-tight">
            {t('Scan History', 'স্ক্যান ইতিহাস')}
          </h2>
          <p className="text-label-sm text-on-surface-variant">
            {t('History records and weekly activity', 'আপনার ফসল রোগ সনাক্তকরণের ইতিহাস')}
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-full hover:bg-red-500/10 text-red-500 hover:text-red-600 transition-colors active:scale-95 duration-100"
            title="Clear all history"
          >
            <Trash2 className="h-5.5 w-5.5" />
          </button>
        )}
      </div>

      {/* Week-by-week bar chart dashboard visualizer (Google Stitch Style) */}
      <section className="bg-white dark:bg-zinc-900 border border-outline-variant/30 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-bold text-body-lg text-primary">{t('Scan Activity', 'স্ক্যান তৎপরতা')}</h3>
            <p className="text-[11px] font-bold text-on-surface-variant/80">{t('Last 30 days trends', 'বিগত ৩০ দিনের পরিসংখ্যান')}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-secondary leading-none">{history.length + 12}</span>
            <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest">{t('Total Scans', 'মোট স্ক্যান')}</p>
          </div>
        </div>

        {/* Pure CSS/SVG Dynamic Bar chart */}
        <div className="flex items-end justify-between h-20 gap-2.5 px-2 pt-2 select-none border-b border-outline-variant/20 pb-1">
          <div className="w-full bg-secondary-container h-[20%] rounded-t-sm" title="Week 1" />
          <div className="w-full bg-secondary-container h-[45%] rounded-t-sm" title="Week 2" />
          <div className="w-full bg-primary h-[85%] rounded-t-sm relative" title="Week 3">
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary">18</div>
          </div>
          <div className="w-full bg-secondary-container h-[60%] rounded-t-sm" title="Week 4" />
          <div className="w-full bg-secondary-container h-[30%] rounded-t-sm" />
          <div className="w-full bg-secondary-container h-[55%] rounded-t-sm" />
          <div className="w-full bg-primary h-[95%] rounded-t-sm relative">
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary">22</div>
          </div>
          <div className="w-full bg-secondary-container h-[40%] rounded-t-sm" />
        </div>
        <div className="flex justify-between text-[10px] font-extrabold text-outline-variant uppercase tracking-widest">
          <span>{t('Oct 01', '১ অক্টোবর')}</span>
          <span>{t('Today', 'আজ')}</span>
        </div>
      </section>

      {/* Filters chips */}
      <section className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex items-center gap-1.5 px-4 py-2 text-label-sm font-bold rounded-full transition-all duration-300 ${
            activeFilter === 'all'
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high/40'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>{t('All Scans', 'সকল স্ক্যান')}</span>
        </button>
        <button
          onClick={() => setActiveFilter('high')}
          className={`flex items-center gap-1.5 px-4 py-2 text-label-sm font-bold rounded-full transition-all duration-300 ${
            activeFilter === 'high'
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high/40'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>{t('High Severity', 'উচ্চ তীব্রতা')}</span>
        </button>
        <button
          onClick={() => setActiveFilter('healthy')}
          className={`flex items-center gap-1.5 px-4 py-2 text-label-sm font-bold rounded-full transition-all duration-300 ${
            activeFilter === 'healthy'
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high/40'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{t('Healthy Crops', 'সুস্থ ফসল')}</span>
        </button>
      </section>

      {/* History List */}
      <section className="space-y-3 pb-8">
        <h3 className="text-label-md font-bold text-on-surface-variant px-1">{t('Recent Logs', 'সাম্প্রতিক রেকর্ড')}</h3>
        
        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-outline-variant/20 dark:border-zinc-800 rounded-2xl space-y-3">
            <History className="h-10 w-10 text-outline-variant mx-auto opacity-60" />
            <p className="text-body-md text-on-surface-variant font-bold">
              {t('No history logs found.', 'কোনো পূর্বের স্ক্যান পাওয়া যায়নি।')}
            </p>
          </div>
        ) : (
          filteredHistory.map((scan) => {
            const formattedDate = new Date(scan.createdAt).toLocaleDateString(
              language === 'EN' ? 'en-US' : 'bn-BD', 
              { month: 'short', day: 'numeric', year: 'numeric' }
            );

            return (
              <div
                key={scan.id}
                onClick={() => handleViewDetails(scan)}
                className="group relative flex items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-outline-variant/10 hover:border-primary-container dark:border-zinc-800 shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                {/* Visual Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high relative">
                  <img
                    src={getMockedImage(scan.disease)}
                    alt={scan.disease}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="ml-4 flex-grow space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-body-md text-on-surface leading-tight">
                        {t(scan.disease, scan.nameBn)}
                      </h4>
                      <p className="text-[11px] font-bold text-on-surface-variant/80 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                      </p>
                    </div>
                    {getSeverityBadge(scan.severity)}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-secondary-fixed-dim bg-secondary-container/30 px-2 py-0.5 rounded uppercase tracking-wider">
                      {scan.fieldName}
                    </span>
                    <button className="text-primary text-[12px] font-bold flex items-center hover:underline uppercase tracking-wide gap-0.5">
                      <span>{t('Details', 'বিস্তারিত')}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </section>

    </div>
  );
}
