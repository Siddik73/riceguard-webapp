'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sliders, ShieldCheck, LineChart, TableProperties, Cpu, 
  Activity, CheckCircle, Network, HardDrive, RefreshCcw 
} from 'lucide-react';

interface ModelVersion {
  id: string;
  name: string;
  version: string;
  status: string;
  accuracy: number;
  trafficSplit: number;
}

interface SystemMetrics {
  totalInferences: number;
  avgLatencyMs: number;
  successRatePct: number;
  gpuLoadPct: number;
  status: string;
}

export default function AdminModelPanel() {
  const { language, t } = useLanguage();
  
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalInferences: 1200042,
    avgLatencyMs: 142,
    successRatePct: 99.98,
    gpuLoadPct: 42,
    status: "ALL NODES ACTIVE"
  });

  const [routingSplit, setRoutingSplit] = useState(90); // default v2.0 split
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRegistry = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/admin/models`);
      if (res.ok) {
        const body = await res.json();
        setModels(body.data);
        
        // Locate prod split
        const prodModel = body.data.find((m: ModelVersion) => m.version === 'v2.0.4');
        if (prodModel) {
          setRoutingSplit(prodModel.trafficSplit);
        }
      }

      const metricsRes = await fetch(`${backendUrl}/api/admin/metrics`);
      if (metricsRes.ok) {
        const body = await metricsRes.json();
        setMetrics(body);
      }
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  const handleApplySplit = async () => {
    setIsUpdating(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Update v2.0.4 split
      const resA = await fetch(`${backendUrl}/api/admin/models/split`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: 'v2.0.4', split: routingSplit })
      });

      // Update testing candidate v2.1.0 split
      const resB = await fetch(`${backendUrl}/api/admin/models/split`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: 'v2.1.0', split: 100 - routingSplit })
      });

      if (resA.ok && resB.ok) {
        alert(t('Traffic split configurations successfully deployed!', 'ট্রাফিকের গতিপথ সফলভাবে সমন্বয় করা হয়েছে!'));
        fetchRegistry();
      }
    } catch (err) {
      console.error('Failed to save splits:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (statusStr: string) => {
    const s = statusStr.toUpperCase();
    if (s === 'ACTIVE') {
      return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">ACTIVE</span>;
    } else if (s === 'TESTING') {
      return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-bold">TESTING</span>;
    } else {
      return <span className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/30 px-2 py-0.5 rounded text-[10px] font-bold">DEPRECATED</span>;
    }
  };

  return (
    <div className="bg-[#0E3727] text-[#E8FFF0] min-h-[85vh] rounded-2xl p-5 space-y-6 select-none border border-primary/20 shadow-xl overflow-hidden font-body relative">
      
      {/* Dynamic Swaying ambient matrix background */}
      <div className="absolute inset-0 chart-grid opacity-30 pointer-events-none" />

      {/* Header bar */}
      <section className="flex justify-between items-center relative z-10 border-b border-outline-variant/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-primary-fixed tracking-tight">{t('Model Upload Panel', 'মডেল কন্ট্রোল প্যানেল')}</h2>
          <p className="text-[11px] text-surface-variant/80 font-bold uppercase tracking-wider">{t('A/B Testing Traffic Router', 'এ/বি টেস্টিং ট্রাফিক রাউটার')}</p>
        </div>
        <button
          onClick={fetchRegistry}
          className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-primary-fixed active:scale-95 duration-100 transition-all"
        >
          <RefreshCcw className="h-4.5 w-4.5" />
        </button>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        
        {/* Total Inferences */}
        <div className="glass-card p-3 rounded-xl">
          <div className="flex justify-between items-center mb-1 text-surface-variant/60">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('Inferences', 'মোট স্ক্যান')}</span>
            <Activity className="h-3.5 w-3.5" />
          </div>
          <p className="text-lg font-black text-primary-fixed leading-none">{metrics.totalInferences.toLocaleString()}</p>
        </div>

        {/* Avg Latency */}
        <div className="glass-card p-3 rounded-xl">
          <div className="flex justify-between items-center mb-1 text-surface-variant/60">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('Latency', 'গড় সময়')}</span>
            <Cpu className="h-3.5 w-3.5" />
          </div>
          <p className="text-lg font-black text-primary-fixed leading-none">{metrics.avgLatencyMs} ms</p>
        </div>

        {/* Success Rate */}
        <div className="glass-card p-3 rounded-xl">
          <div className="flex justify-between items-center mb-1 text-surface-variant/60">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('Success Rate', 'সাফল্যের হার')}</span>
            <CheckCircle className="h-3.5 w-3.5" />
          </div>
          <p className="text-lg font-black text-primary-fixed leading-none">{metrics.successRatePct}%</p>
        </div>

        {/* GPU Load */}
        <div className="glass-card p-3 rounded-xl">
          <div className="flex justify-between items-center mb-1 text-surface-variant/60">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('GPU Load', 'জিপিইউ লোড')}</span>
            <HardDrive className="h-3.5 w-3.5" />
          </div>
          <p className="text-lg font-black text-primary-fixed leading-none">{metrics.gpuLoadPct}%</p>
        </div>
      </section>

      {/* A/B Routing Controller */}
      <section className="glass-card rounded-xl p-4 border-2 border-secondary/20 space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-secondary-fixed-dim" />
          <h3 className="font-bold text-body-lg text-primary-fixed">{t('A/B Routing Controller', 'ট্রাফিক বিভাজন নিয়ন্ত্রণ')}</h3>
        </div>

        <div className="flex justify-between items-center text-center py-2 bg-black/20 rounded-xl px-4">
          <div>
            <span className="text-2xl font-black text-primary-fixed leading-none">{routingSplit}%</span>
            <p className="text-[10px] font-extrabold text-surface-variant/80 uppercase tracking-widest">v2.0.4 (Prod)</p>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div>
            <span className="text-2xl font-black text-secondary-fixed-dim leading-none">{100 - routingSplit}%</span>
            <p className="text-[10px] font-extrabold text-surface-variant/80 uppercase tracking-widest">v2.1.0 (Beta)</p>
          </div>
        </div>

        {/* Traffic Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={routingSplit}
            onChange={(e) => setRoutingSplit(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-[#19724f] rounded-lg appearance-none cursor-pointer border border-outline-variant/30 outline-none"
          />
          <div className="flex justify-between text-[9px] font-bold text-surface-variant/60">
            <span>100% PRODUCTION</span>
            <span>BALANCE</span>
            <span>100% BETA TEST</span>
          </div>
        </div>

        <button
          onClick={handleApplySplit}
          disabled={isUpdating}
          className="w-full h-11 bg-primary text-white hover:bg-primary/80 transition-opacity font-bold text-label-sm rounded-lg shadow-md active:scale-95 duration-100 flex items-center justify-center gap-2 select-none"
        >
          {isUpdating ? t('Deploying split...', 'ডেপ্লয় হচ্ছে...') : t('Apply Split Config', 'গতিপথ আপডেট করুন')}
        </button>
      </section>

      {/* Accuracy line chart visual */}
      <section className="glass-card rounded-xl p-4 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-secondary-fixed-dim" />
            <h3 className="font-bold text-body-lg text-primary-fixed">{t('Accuracy Comparison', 'মডেলের নির্ভুলতা তুলনা')}</h3>
          </div>
          <div className="flex gap-3 text-[10px] font-bold">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span>v2.1.0</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              <span>v2.0.4</span>
            </div>
          </div>
        </div>

        {/* Custom drawn line graphs */}
        <div className="h-32 rounded-lg border border-outline-variant/10 relative flex items-end justify-between px-3 pb-1 select-none overflow-hidden bg-black/10">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Prod v2.0 */}
            <path d="M0 80 Q 25 70, 50 40 T 100 10" fill="none" stroke="#2D6A4F" strokeWidth="3" />
            {/* Beta v2.1 */}
            <path d="M0 85 Q 25 80, 50 65 T 100 45" fill="none" stroke="#707973" strokeDasharray="3" strokeWidth="2" />
          </svg>
          <span className="text-[9px] text-surface-variant/40 font-bold z-10">Day 1</span>
          <span className="text-[9px] text-surface-variant/40 font-bold z-10">Day 7</span>
          <span className="text-[9px] text-surface-variant/40 font-bold z-10">Today</span>
        </div>
      </section>

      {/* Model registry table */}
      <section className="glass-card rounded-xl overflow-hidden relative z-10">
        <div className="p-4 border-b border-outline-variant/10 flex items-center gap-2">
          <TableProperties className="h-5 w-5 text-secondary-fixed-dim" />
          <h3 className="font-bold text-body-lg text-primary-fixed">{t('Version Registry', 'মডেল সংস্করণ তালিকা')}</h3>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-body-md">
            <thead className="bg-black/20 text-[10px] font-bold text-surface-variant/70 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">{t('Model', 'মডেল')}</th>
                <th className="px-4 py-3">{t('Version', 'সংস্করণ')}</th>
                <th className="px-4 py-3">{t('Status', 'অবস্থা')}</th>
                <th className="px-4 py-3">{t('Accuracy', 'নির্ভুলতা')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 font-medium">
              {models.map((model) => (
                <tr key={model.version} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 truncate max-w-[100px]">{model.name}</td>
                  <td className="px-4 py-3 text-primary-fixed">{model.version}</td>
                  <td className="px-4 py-3">{getStatusBadge(model.status)}</td>
                  <td className="px-4 py-3 text-primary-fixed">{model.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Node status indicator banner */}
      <div className="p-3 bg-black/20 border-l-4 border-secondary/30 rounded-xl relative z-10">
        <div className="flex items-center gap-2 text-caption">
          <span className="relative flex h-2.5 w-2.5 select-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
          </span>
          <span className="font-extrabold tracking-wider text-secondary-fixed-dim">{metrics.status}</span>
        </div>
      </div>

    </div>
  );
}
