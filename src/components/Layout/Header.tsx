"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Hajj Guide",
    href: "/hajj-guide",
  },
  {
    label: "Umrah Guide",
    href: "/umrah-guide",
  },
  {
    label: "Destinations",
    href: "/destinations",
  },
  {
    label: "Tips & Advice",
    href: "/tips-and-advice",
  },
  {
    label: "News",
    href: "/news",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-soft-beige bg-white">
      {/* Main Header */}
      <div className="mx-auto flex h-[74px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="shrink-0">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="group flex flex-col leading-none"
          >
            <span className="text-[19px] font-semibold tracking-tight text-deep-teal transition-colors duration-200 group-hover:text-emerald">
              Noor Al Haramain
            </span>

            <span className="mt-1 text-[9px] font-medium tracking-[0.28em] text-gold">
              HAJJ & UMRAH <span className="text-deep-teal">|</span> BLOG
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden items-center lg:flex">
          <div className="flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-7 text-[13px] font-medium text-charcoal transition-colors duration-200 hover:text-emerald"
              >
                {link.label}

                <span className="absolute bottom-3 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gold transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}

            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-deep-teal transition-colors duration-200 hover:bg-warm-white hover:text-emerald"
            >
              <Search className="h-[19px] w-[19px]" strokeWidth={1.7} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="ml-auto flex items-center lg:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-deep-teal transition-colors hover:bg-warm-white hover:text-emerald"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-soft-beige bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <div className="flex flex-col">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3.5 text-sm font-medium text-charcoal transition-colors hover:text-emerald ${
                    index !== navLinks.length - 1
                      ? "border-b border-soft-beige"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Search */}
              <button
                type="button"
                className="mt-3 flex items-center gap-2 py-3 text-left text-sm font-medium text-charcoal transition-colors hover:text-emerald"
              >
                <Search className="h-4 w-4" strokeWidth={1.8} />
                Search
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}