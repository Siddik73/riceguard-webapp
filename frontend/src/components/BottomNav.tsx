'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, History, BookOpen, Settings } from 'lucide-react';

interface BottomNavProps {
  lang: 'EN' | 'BN';
}

export default function BottomNav({ lang }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      path: '/',
      icon: Home,
      labelEn: 'Home',
      labelBn: 'হোম'
    },
    {
      path: '/scan',
      icon: Scan,
      labelEn: 'Scan',
      labelBn: 'স্ক্যান'
    },
    {
      path: '/history',
      icon: History,
      labelEn: 'History',
      labelBn: 'ইতিহাস'
    },
    {
      path: '/library',
      icon: BookOpen,
      labelEn: 'Library',
      labelBn: 'লাইব্রেরি'
    },
    {
      path: '/admin',
      icon: Settings,
      labelEn: 'Admin',
      labelBn: 'এডমিন'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 bg-surface dark:bg-zinc-900 border-t border-outline-variant/40 dark:border-zinc-800 shadow-2xl rounded-t-2xl px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 px-1 relative transition-all duration-300 ease-in-out select-none active:scale-90 tap-highlight-transparent group`}
          >
            {/* Ambient indicator capsule backdrop */}
            <div
              className={`absolute top-2 w-14 h-8 rounded-full transition-all duration-300 -z-10 ${
                isActive 
                  ? 'bg-secondary-container dark:bg-on-secondary-container opacity-100 scale-100' 
                  : 'bg-transparent opacity-0 scale-50 group-hover:bg-surface-container-high/40 group-hover:scale-90 group-hover:opacity-40'
              }`}
            />

            {/* Icon */}
            <Icon 
              className={`h-6 w-6 mb-1 transition-all duration-300 ${
                isActive 
                  ? 'text-on-secondary-container dark:text-secondary-container scale-110' 
                  : 'text-on-surface-variant dark:text-zinc-400 group-hover:text-primary'
              }`} 
            />

            {/* Label */}
            <span
              className={`text-[11px] font-bold tracking-tight transition-all duration-300 ${
                isActive 
                  ? 'text-primary dark:text-primary-fixed' 
                  : 'text-on-surface-variant/80 dark:text-zinc-500'
              }`}
            >
              {lang === 'EN' ? item.labelEn : item.labelBn}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
