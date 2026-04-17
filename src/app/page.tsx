import Link from "next/link";

const stats = [
  { value: "40+", label: "Projekte abgeschlossen" },
  { value: "98%", label: "Kundenzufriedenheit" },
  { value: "3×", label: "Ø Umsatzwachstum" },
  { value: "48h", label: "Reaktionszeit" },
];

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    title: "Webentwicklung",
    subtitle: "Websites, die konvertieren",
    description:
      "Wir entwickeln professionelle Unternehmenswebsites, Landingpages und Online-Shops — technisch erstklassig, visuell überzeugend, messbar effektiv.",
    href: "/leistungen#webentwicklung",
    highlights: ["Next.js & moderne Technologien", "SEO-optimiert & schnell", "Mobile-first Design"],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    ),
    title: "Prozessautomatisierung",
    subtitle: "Effizienz durch Technologie",
    description:
      "Wir automatisieren manuelle, zeitaufwändige Prozesse — von der Angebotserstellung bis zur Kundenkommunikation. Mehr Output, weniger Aufwand.",
    href: "/leistungen#prozessautomatisierung",
    highlights: ["Workflows & Integrationen", "CRM-Anbindung", "Dokumentenmanagement"],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Vertriebsdigitalisierung",
    subtitle: "Mehr Leads, mehr Abschlüsse",
    description:
      "Wir digitalisieren Ihren Vertriebsprozess — von der Lead-Generierung über das Nurturing bis zum Abschluss. Systeme, die nachts für Sie arbeiten.",
    href: "/leistungen#vertriebsdigitalisierung",
    highlights: ["Lead-Generierung & Funnel", "E-Mail-Automatisierung", "Sales-Dashboard"],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Analyse & Strategie",
    description: "Wir analysieren Ihre aktuelle Situation, identifizieren Potenziale und entwickeln eine maßgeschneiderte Digitalstrategie.",
  },
  {
    number: "02",
    title: "Konzept & Design",
    description: "Unser Team entwickelt ein überzeugendes Konzept und Design, das zu Ihrer Marke und Zielgruppe passt.",
  },
  {
    number: "03",
    title: "Entwicklung & Integration",
    description: "Wir setzen die Lösung technisch um — sauber, skalierbar, integriert in Ihre bestehende Infrastruktur.",
  },
  {
    number: "04",
    title: "Launch & Wachstum",
    description: "Nach dem Launch begleiten wir Sie kontinuierlich und optimieren auf Basis von Daten und Ergebnissen.",
  },
];

const testimonials = [
  {
    quote:
      "Durch die neue Website und den automatisierten Anfrageprozess haben wir unsere Kundenkontakte um 180% gesteigert — in weniger als drei Monaten.",
    author: "Michael B.",
    role: "Inhaber, Immobilienmakler Frankfurt",
    initials: "MB",
  },
  {
    quote:
      "ELEVO hat unseren gesamten Onboarding-Prozess digitalisiert. Was früher 3 Stunden dauerte, läuft jetzt vollautomatisch in 15 Minuten.",
    author: "Sandra K.",
    role: "Geschäftsführerin, Steuerberatungskanzlei",
    initials: "SK",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#0A1628] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gold gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #E8A835 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-36">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A835]" />
              <span className="text-white/70 text-xs font-medium tracking-wide uppercase">
                Digitalisierung für den Mittelstand
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Ihr Unternehmen,{" "}
              <span className="text-gold-gradient">digital auf dem nächsten Level</span>
            </h1>

            <p className="text-white/60 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl">
              Wir sind ELEVO — die Digitalagentur für mittelständische Unternehmen in Deutschland. Websites, Prozesse, Vertrieb: alles aus einer Hand, mit messbaren Ergebnissen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/kontakt" className="btn-primary text-center">
                Kostenlose Beratung anfragen
              </Link>
              <Link href="/leistungen" className="btn-secondary text-center">
                Leistungen entdecken
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex flex-wrap items-center gap-6 mt-12 pt-12 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 text-[#E8A835]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Keine Vorauszahlung
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 text-[#E8A835]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Festpreisgarantie
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 text-[#E8A835]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Made in Germany
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0D1F38] border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gold-gradient mb-1.5">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#F8F9FC] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-4">
              Was wir für Sie tun
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Drei Kernleistungen, ein Ziel: Ihr Unternehmen digital wettbewerbsfähig zu machen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FDF4E3] text-[#C8911E] flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <div className="text-[#C8911E] text-xs font-semibold uppercase tracking-wider mb-2">
                  {service.subtitle}
                </div>
                <h3 className="text-xl font-bold text-[#0A1628] mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-2 mb-8">
                  {service.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8911E] flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="text-[#C8911E] text-sm font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all"
                >
                  Mehr erfahren
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-5">
                So arbeiten wir zusammen
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Von der ersten Analyse bis zum nachhaltigen Wachstum — unser bewährter Prozess bringt Ihre Digitalisierung strukturiert ans Ziel.
              </p>
              <Link href="/kontakt" className="btn-outline">
                Projekt starten
              </Link>
            </div>

            <div className="space-y-8">
              {processSteps.map((step, i) => (
                <div key={step.number} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-[#C8911E] flex items-center justify-center">
                      <span className="text-[#C8911E] font-bold text-sm">{step.number}</span>
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-semibold text-[#0A1628] mb-1.5">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reference Teaser */}
      <section className="bg-[#0A1628] py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Referenzprojekte
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Sehen Sie, wie wir für unsere Kunden messbare Ergebnisse erzielen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Featured Reference */}
            <div className="md:col-span-2 bg-white/6 border border-white/12 rounded-2xl p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-xl bg-[#C8911E]/20 border border-[#C8911E]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-[#E8A835]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-[#C8911E]/15 border border-[#C8911E]/25 rounded-full px-3 py-1 mb-4">
                    <span className="text-[#E8A835] text-xs font-semibold uppercase tracking-wider">Immobilien</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Digitaler Auftritt für Maklerunternehmen, Frankfurt
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">
                    Vollständige digitale Transformation eines Immobilienmaklers: neue Website mit Expose-Generator, automatisierter Lead-Qualifizierung und integriertem CRM — Anfragen um 180% gesteigert.
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <div className="text-2xl font-bold text-[#E8A835]">+180%</div>
                      <div className="text-white/40 text-xs mt-0.5">Mehr Anfragen</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#E8A835]">6 Wo.</div>
                      <div className="text-white/40 text-xs mt-0.5">Projektdauer</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#E8A835]">3,2×</div>
                      <div className="text-white/40 text-xs mt-0.5">ROI nach 6 Monaten</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/6 border border-white/12 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#E8A835]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7.5 21H3a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 013 3h11.379a2.25 2.25 0 011.59.659l2.122 2.121a2.25 2.25 0 01.659 1.591V10.5" />
                </svg>
              </div>
              <div className="text-[#E8A835] text-xs font-semibold uppercase tracking-wider mb-2">Steuerberatung</div>
              <h3 className="text-base font-bold text-white mb-2">Prozessautomatisierung Kanzlei</h3>
              <p className="text-white/40 text-sm leading-relaxed">Onboarding-Prozess von 3 Stunden auf 15 Minuten reduziert. Vollständig automatisiert.</p>
            </div>

            <div className="bg-white/6 border border-white/12 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#E8A835]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
              <div className="text-[#E8A835] text-xs font-semibold uppercase tracking-wider mb-2">Einzelhandel</div>
              <h3 className="text-base font-bold text-white mb-2">E-Commerce Integration</h3>
              <p className="text-white/40 text-sm leading-relaxed">Online-Shop mit Lagerverwaltung und automatisierter Bestellabwicklung für regionalen Händler.</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/referenzen" className="btn-secondary">
              Alle Referenzen ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F8F9FC] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-4">
              Was unsere Kunden sagen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-white rounded-2xl p-8 border border-gray-100 card-hover">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#E8A835]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-600 text-sm leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">{t.initials}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1628] text-sm">{t.author}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#0A1628] to-[#122040] py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #E8A835 0%, transparent 70%)",
            transform: "translate(-40%, -40%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5">
            Bereit, Ihr Unternehmen zu digitalisieren?
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Vereinbaren Sie ein kostenloses Erstgespräch. Wir analysieren Ihr Potenzial und zeigen Ihnen konkrete Möglichkeiten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kontakt" className="btn-primary">
              Kostenlos beraten lassen
            </Link>
            <Link href="/leistungen" className="btn-secondary">
              Leistungen ansehen
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-6">
            Kein Risiko. Keine Verpflichtung. 100% kostenlos.
          </p>
        </div>
      </section>
    </>
  );
}
