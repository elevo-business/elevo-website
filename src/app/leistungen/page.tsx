import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Leistungen — ELEVO Digitalagentur",
  description:
    "Webentwicklung, Prozessautomatisierung und Vertriebsdigitalisierung für den deutschen Mittelstand. Professionelle Lösungen mit messbaren Ergebnissen.",
};

const services = [
  {
    id: "webentwicklung",
    label: "01 — Webentwicklung",
    title: "Websites, die für Sie arbeiten",
    subtitle: "Webentwicklung",
    description:
      "Eine professionelle Website ist heute kein Nice-to-have — sie ist Ihr wichtigstes Vertriebsinstrument. Wir entwickeln Websites, die Besucher in Kunden verwandeln: technisch einwandfrei, visuell überzeugend, SEO-optimiert.",
    features: [
      {
        title: "Corporate Websites",
        description: "Mehrsprachige, skalierbare Unternehmenswebsites, die Vertrauen aufbauen und Leads generieren.",
      },
      {
        title: "Landingpages & Kampagnenseiten",
        description: "Conversion-optimierte Seiten für Ihre Marketing-Kampagnen — von der Konzeption bis zum A/B-Test.",
      },
      {
        title: "Online-Shops & E-Commerce",
        description: "Individuelle Shop-Lösungen mit integrierter Zahlungsabwicklung und Lagerverwaltung.",
      },
      {
        title: "Portale & Web-Applikationen",
        description: "Kundenportale, Buchungssysteme und maßgeschneiderte Web-Apps für komplexe Anforderungen.",
      },
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Strapi CMS"],
    deliverables: [
      "Vollständig responsive für alle Geräte",
      "Core Web Vitals optimiert (Google-konform)",
      "On-Page SEO & strukturierte Daten",
      "DSGVO-konform & barrierefrei",
      "Analyse-Integration (GA4, Hotjar)",
      "12 Monate Hosting & Support inklusive",
    ],
    priceFrom: "ab 4.900 €",
    timeFrom: "ab 3 Wochen",
  },
  {
    id: "prozessautomatisierung",
    label: "02 — Prozessautomatisierung",
    title: "Prozesse, die sich selbst erledigen",
    subtitle: "Prozessautomatisierung",
    description:
      "Manuelle, repetitive Prozesse kosten Zeit und Geld. Wir identifizieren die Potenziale in Ihrem Unternehmen und automatisieren sie — von der einfachen Workflow-Automatisierung bis zur komplexen Systemintegration.",
    features: [
      {
        title: "Workflow-Automatisierung",
        description: "Angebote, Rechnungen, Onboarding, Kundenkommunikation — alles automatisch, ohne manuelle Eingriffe.",
      },
      {
        title: "CRM-Implementierung & Integration",
        description: "Einführung und Integration von CRM-Systemen, die Ihr Vertriebsteam wirklich nutzt.",
      },
      {
        title: "Dokumentenmanagement",
        description: "Digitale Dokumentenverarbeitung, elektronische Signaturen und automatisiertes Ablagesystem.",
      },
      {
        title: "API-Integrationen",
        description: "Verbinden Sie Ihre bestehenden Tools — ERP, Buchhaltung, Marketing — zu einem nahtlosen System.",
      },
    ],
    techStack: ["Make (Integromat)", "n8n", "Zapier", "REST APIs", "HubSpot", "Pipedrive"],
    deliverables: [
      "Prozessanalyse & Potenzialermittlung",
      "Technologie-Empfehlung & Konzept",
      "Implementierung & Testing",
      "Schulung Ihrer Mitarbeiter",
      "Dokumentation aller Workflows",
      "3 Monate After-Go-Live Support",
    ],
    priceFrom: "ab 2.900 €",
    timeFrom: "ab 2 Wochen",
  },
  {
    id: "vertriebsdigitalisierung",
    label: "03 — Vertriebsdigitalisierung",
    title: "Vertrieb, der rund um die Uhr läuft",
    subtitle: "Vertriebsdigitalisierung",
    description:
      "Ihr Vertrieb sollte nicht schlafen, wenn Sie es tun. Wir digitalisieren Ihre gesamte Vertriebsstrecke — von der ersten Berührung bis zum Vertragsabschluss. Mehr Leads, bessere Qualifizierung, höhere Abschlussquote.",
    features: [
      {
        title: "Lead-Generierung & Funnel-Aufbau",
        description: "Digitale Verkaufstrichter, die qualifizierte Interessenten automatisch zu Kunden entwickeln.",
      },
      {
        title: "E-Mail-Marketing & Nurturing",
        description: "Automatisierte E-Mail-Sequenzen, die im richtigen Moment die richtige Botschaft senden.",
      },
      {
        title: "Sales-Dashboard & Reporting",
        description: "Echtzeit-Übersicht über Ihren gesamten Vertrieb — Leads, Pipeline, Abschlüsse, Umsatz.",
      },
      {
        title: "Angebots- & Vertragsautomatisierung",
        description: "Professionelle Angebote in Minuten statt Stunden — automatisiert erstellt und verschickt.",
      },
    ],
    techStack: ["HubSpot", "ActiveCampaign", "Klaviyo", "Calendly", "DocuSign", "Custom Dashboards"],
    deliverables: [
      "Vertriebsstrategie & Funnel-Konzept",
      "Technologie-Stack Empfehlung",
      "Implementierung & Setup",
      "Lead-Magneten & Content-Erstellung",
      "Sales-Skripte & E-Mail-Sequenzen",
      "Monatliches Reporting & Optimierung",
    ],
    priceFrom: "ab 3.500 €",
    timeFrom: "ab 4 Wochen",
  },
];

export default function LeistungenPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="gold-divider mb-8" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">
              Unsere Leistungen
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Drei Kernbereiche, eine Mission: Ihr Unternehmen digital stark machen. Jede Leistung ist auf die spezifischen Anforderungen des deutschen Mittelstands zugeschnitten.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-24 lg:py-32 ${index % 2 === 0 ? "bg-white" : "bg-[#F8F9FC]"}`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Header */}
            <div className="mb-16">
              <div className="text-[#C8911E] text-sm font-semibold uppercase tracking-wider mb-3">
                {service.label}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-5">
                {service.title}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Features */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
                  Was wir liefern
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.features.map((feature) => (
                    <div key={feature.title} className="bg-white border border-gray-100 rounded-xl p-6 card-hover">
                      <div className="w-2 h-2 rounded-full bg-[#C8911E] mb-4" />
                      <h4 className="font-semibold text-[#0A1628] mb-2">{feature.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                    Technologien
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-[#F8F9FC] border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* Deliverables */}
                <div className="bg-[#0A1628] rounded-2xl p-6 mb-6">
                  <h3 className="text-white font-semibold mb-5">Im Leistungsumfang</h3>
                  <ul className="space-y-3">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <svg className="w-4 h-4 text-[#E8A835] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/60 text-sm">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="bg-[#FDF4E3] border border-[#E8A835]/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-500 text-sm">Investition</span>
                    <span className="text-[#C8911E] font-bold text-lg">{service.priceFrom}</span>
                  </div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-gray-500 text-sm">Projektdauer</span>
                    <span className="text-[#0A1628] font-semibold text-sm">{service.timeFrom}</span>
                  </div>
                  <Link href="/kontakt" className="btn-primary text-sm text-center block">
                    Unverbindlich anfragen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-[#0A1628] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Nicht sicher, was Sie brauchen?
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
            In einem kostenlosen 30-Minuten-Gespräch analysieren wir Ihre Situation und empfehlen die optimale Lösung.
          </p>
          <Link href="/kontakt" className="btn-primary">
            Kostenloses Erstgespräch buchen
          </Link>
        </div>
      </section>
    </>
  );
}
