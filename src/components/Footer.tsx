import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080F1D] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E8A835] to-[#C8911E] flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-white font-semibold text-xl tracking-tight">ELEVO</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Wir digitalisieren mittelständische Unternehmen in Deutschland — mit Websites, die konvertieren, Prozessen, die skalieren, und Vertrieb, der funktioniert.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded border border-white/15 flex items-center justify-center text-white/50 hover:text-[#E8A835] hover:border-[#E8A835] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Leistungen</h4>
            <ul className="space-y-3">
              {[
                { label: "Webentwicklung", href: "/leistungen#webentwicklung" },
                { label: "Prozessautomatisierung", href: "/leistungen#prozessautomatisierung" },
                { label: "Vertriebsdigitalisierung", href: "/leistungen#vertriebsdigitalisierung" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/50 text-sm hover:text-[#E8A835] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Unternehmen</h4>
            <ul className="space-y-3">
              {[
                { label: "Über uns", href: "/ueber-uns" },
                { label: "Referenzen", href: "/referenzen" },
                { label: "Kontakt", href: "/kontakt" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/50 text-sm hover:text-[#E8A835] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} ELEVO GmbH. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
