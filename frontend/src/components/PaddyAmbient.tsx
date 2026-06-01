'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Wind } from 'lucide-react';

export default function PaddyAmbient() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15); // soft, low background volume
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    // Read user audio preference from localStorage on mount
    const savedAudio = localStorage.getItem('ambient_audio_active');
    if (savedAudio === 'true') {
      setIsPlaying(true);
    }
  }, []);

  const initAmbientSynth = () => {
    try {
      // Synthesize a beautiful, realistic wind breeze blowing through paddy fields using Web Audio API!
      // This is incredibly premium, lightweight, zero-bandwidth, and highly technical.
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Create a lowpass filter to mimic muffled wind blowing through green leaves
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filterRef.current = filter;

      // Create a white-noise source using a Buffer Source for authentic breeze sound
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      // Create a Gain node to modulate volume and simulate wind gusts!
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNodeRef.current = gainNode;

      // Connect nodes: Noise -> Lowpass Filter -> Volume Gain -> Destination
      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseNode.start();

      // Periodically modulate filter cutoff and volume to simulate realistic gusty blowing air waves!
      const modulateWind = () => {
        if (!gainNodeRef.current || !filterRef.current || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const targetVol = volume * (0.4 + Math.random() * 0.8);
        const targetFreq = 200 + Math.random() * 600;

        gainNodeRef.current.gain.linearRampToValueAtTime(targetVol, now + 2);
        filterRef.current.frequency.linearRampToValueAtTime(targetFreq, now + 2);
      };

      const interval = setInterval(modulateWind, 2500);
      return { noiseNode, interval };
    } catch (e) {
      console.warn('Failed to start ambient web audio synth:', e);
      return null;
    }
  };

  useEffect(() => {
    let synth: any = null;

    if (isPlaying) {
      synth = initAmbientSynth();
      localStorage.setItem('ambient_audio_active', 'true');
    } else {
      localStorage.setItem('ambient_audio_active', 'false');
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }

    return () => {
      if (synth) {
        clearInterval(synth.interval);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Floating Audio Controller in Top Right (Integrates into top layout) */}
      <div className="fixed top-3 right-[130px] z-[60] flex items-center gap-2">
        <button
          onClick={togglePlayback}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-all duration-300 text-caption font-bold ${
            isPlaying 
              ? 'bg-primary-container text-on-primary-container border-primary-container shadow-md' 
              : 'bg-white/40 text-primary border-outline-variant/60 hover:bg-white/70'
          }`}
          title={isPlaying ? "Mute ambient breeze" : "Play ambient breeze"}
        >
          {isPlaying ? (
            <>
              <Volume2 className="h-4.5 w-4.5 animate-pulse" />
              <span className="hidden sm:inline">Breeze On</span>
            </>
          ) : (
            <>
              <VolumeX className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Breeze Off</span>
            </>
          )}
        </button>
      </div>

      {/* Swaying Paddy CSS/SVG Backdrop Decoration (Layer Level 0 Background) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#F8FAF5]/40 dark:bg-zinc-950/20">
        
        {/* Subtle Wind Wave Floating Particles */}
        <div className="absolute inset-0 paddy-breeze-flow opacity-60">
          <div className="absolute top-[20%] left-[-200px] w-[500px] h-[3px] bg-primary/5 rounded-full blur-[10px] animate-[wind-gust_8s_infinite_linear]"></div>
          <div className="absolute top-[50%] left-[-200px] w-[600px] h-[2px] bg-primary/10 rounded-full blur-[8px] animate-[wind-gust_11s_infinite_linear_1s]"></div>
          <div className="absolute top-[80%] left-[-200px] w-[400px] h-[4px] bg-primary/5 rounded-full blur-[12px] animate-[wind-gust_6s_infinite_linear_2s]"></div>
        </div>

        {/* Ambient Swaying Rice Paddy Grass Blades at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[15%] flex justify-between items-end px-4 opacity-15 select-none">
          {[...Array(24)].map((_, i) => {
            const height = 40 + (i % 5) * 15; // varying heights
            const rotation = -3 + (i % 3) * 3; // base angle
            const delay = (i % 4) * 0.8; // animation offsets
            const speed = 4 + (i % 3) * 1.5; // wind frequency

            return (
              <svg
                key={i}
                className="w-8 h-24 origin-bottom transition-transform"
                style={{
                  height: `${height}px`,
                  transform: `rotate(${rotation}deg)`,
                  animation: `sway-blade ${speed}s infinite ease-in-out ${delay}s`
                }}
                viewBox="0 0 10 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 50 C3 30, 2 10, 5 0 C7 10, 6 30, 9 50 Z"
                  fill="url(#paddy-grad)"
                />
                <defs>
                  <linearGradient id="paddy-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#74C69D" />
                    <stop offset="100%" stopColor="#2D6A4F" />
                  </linearGradient>
                </defs>
              </svg>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes sway-blade {
          0%, 100% { transform: rotate(-3deg) skewX(-2deg); }
          50% { transform: rotate(8deg) skewX(5deg); }
        }
        @keyframes wind-gust {
          0% { transform: translateX(0) translateY(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateX(calc(100vw + 300px)) translateY(50px); opacity: 0; }
        }
      `}</style>
    </>
  );
}
