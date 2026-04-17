"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/referenzen", label: "Referenzen" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/95 backdrop-blur-sm border-b border-white/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E8A835] to-[#C8911E] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              ELEVO
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-[#E8A835]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/kontakt"
              className="hidden md:inline-block btn-primary text-sm py-2.5 px-5"
            >
              Beratung anfragen
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white/80 hover:text-white p-1"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A1628] border-t border-white/10 px-6 py-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium py-1 ${
                  pathname === link.href ? "text-[#E8A835]" : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              onClick={() => setMenuOpen(false)}
              className="btn-primary text-sm text-center mt-2"
            >
              Beratung anfragen
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
