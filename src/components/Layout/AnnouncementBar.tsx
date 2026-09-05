"use client";

import { Sparkles } from "lucide-react";

const announcements = [
  {
    text: "Essential Guides for Hajj & Umrah Preparation 2026",
    arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ",
  },
  {
    text: "Step-by-Step Rituals & Authentic Duas Available Now",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
  },
  
];

const marqueeItems = [...announcements, ...announcements, ...announcements];

export function AnnouncementBar() {
  return (
    <div
      aria-label="Site announcement"
      className="relative z-50 overflow-hidden border-b border-white/10 bg-dark-teal text-white"
    >
      <p className="sr-only">
        Essential Hajj and Umrah announcements and authentic Islamic reminders.
      </p>

      <div className="mx-auto max-w-7xl px-4 py-2.5">
        <div className="relative flex overflow-hidden">
          {/* Fade Left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-dark-teal to-transparent"
          />

          {/* Fade Right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-dark-teal to-transparent"
          />

          {/* Marquee — .marquee animation class defined in globals.css */}
          <div className="marquee flex min-w-max shrink-0 items-center gap-12 whitespace-nowrap">
            {marqueeItems.map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-8 text-xs font-medium tracking-wide sm:text-sm"
              >
                <span className="flex items-center gap-2 text-white/90 transition-colors duration-300 hover:text-white">
                  <Sparkles
                    className="h-[18px] w-[18px] shrink-0 text-gold-light"
                    strokeWidth={2}
                  />
                  <span>{item.text}</span>
                </span>

                <span dir="rtl" className="text-sm tracking-normal text-gold-light/90">
                  {item.arabic}
                </span>

                <span aria-hidden="true" className="select-none text-white/30">
                  •
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}