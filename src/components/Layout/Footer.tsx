import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  guides: [
    { label: "Hajj Guide", href: "/hajj-guide" },
    { label: "Umrah Guide", href: "/umrah-guide" },
    { label: "Destinations", href: "/destinations" },
    { label: "Tips & Advice", href: "/tips-and-advice" },
  ],

  explore: [
    { label: "News", href: "/news" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    shortLabel: "f",
    href: "#",
  },
  {
    label: "Instagram",
    shortLabel: "ig",
    href: "#",
  },
  {
    label: "YouTube",
    shortLabel: "yt",
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-deep-teal text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex flex-col leading-none"
            >
              <span className="text-xl font-semibold tracking-tight">
                Noor Al Haramain
              </span>

              <span className="mt-1.5 text-[9px] font-medium tracking-[0.28em] text-gold">
                HAJJ & UMRAH{" "}
                <span className="text-white/60">|</span> BLOG
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
              Trusted guidance and helpful information for your Hajj and
              Umrah journey.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold uppercase text-white/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {social.shortLabel}
                </Link>
              ))}
            </div>
          </div>

          {/* Hajj & Umrah */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Hajj & Umrah
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.guides.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-4">

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />

                <span className="text-sm leading-5 text-white/65">
                  United Kingdom
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" />

                <a
                  href="tel:02012345678"
                  className="text-sm text-white/65 transition-colors hover:text-gold"
                >
                  020 1234 5678
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" />

                <a
                  href="mailto:info@nooralharamain.com"
                  className="text-sm text-white/65 transition-colors hover:text-gold"
                >
                  info@nooralharamain.com
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} Noor Al Haramain. All rights
              reserved.
            </p>

            <div className="flex gap-5">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-gold"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition-colors hover:text-gold"
              >
                Terms & Conditions
              </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}