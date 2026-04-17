import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Referenzen — ELEVO Digitalagentur",
  description:
    "Sehen Sie, wie ELEVO mittelständische Unternehmen in Deutschland erfolgreich digitalisiert hat — messbare Ergebnisse, echte Projekte.",
};

const projects = [
  {
    id: "immobilien-frankfurt",
    category: "Immobilien",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "Maklerunternehmen Frankfurt",
    subtitle: "Vollständige digitale Transformation",
    description:
      "Ein etabliertes Frankfurter Maklerunternehmen wollte seinen analogen Akquisitionsprozess digitalisieren. Wir entwickelten eine neue Website mit Expose-Generator, automatisierter Lead-Qualifizierung und einem integrierten CRM-System.",
    challenge:
      "Der Makler generierte fast alle Anfragen über Empfehlungen und persönliche Netzwerke. Die bestehende Website hatte keinen Conversion-Fokus und kaum organischen Traffic.",
    solution:
      "Neue Next.js-Website mit SEO-Strategie, automatisiertem Expose-Generator, Kontaktformular mit Lead-Scoring und HubSpot CRM-Anbindung. Dazu eine Google Ads Landingpage für bezahlten Traffic.",
    results: [
      { metric: "+180%", label: "Mehr qualifizierte Anfragen" },
      { metric: "3,2×", label: "ROI nach 6 Monaten" },
      { metric: "6 Wo.", label: "Projektdauer" },
      { metric: "#1", label: "Google-Ranking für Hauptkeyword" },
    ],
    services: ["Webentwicklung", "SEO-Optimierung", "CRM-Integration", "Lead-Automatisierung"],
    featured: true,
  },
  {
    id: "steuerberatung",
    category: "Steuerberatung",
    categoryColor: "bg-green-100 text-green-700",
    title: "Steuerberatungskanzlei München",
    subtitle: "Prozessautomatisierung Onboarding",
    description:
      "Eine Münchner Steuerberatungskanzlei mit 15 Mitarbeitern hatte einen extrem manuellen Onboarding-Prozess für neue Mandanten — von der Erstanfrage bis zur Vollmacht dauerte es im Schnitt 3 Stunden Aufwand.",
    challenge:
      "Jedes Mandanten-Onboarding bedeutete: manuelle E-Mails, PDF-Formulare per Post, telefonische Abstimmung, manuelle Dateneingabe im DATEV-System. Fehleranfällig und zeitaufwändig.",
    solution:
      "Vollautomatisierter Onboarding-Workflow: digitales Erstgespräch-Booking via Calendly, automatisierte Willkommens-E-Mails, elektronische Vollmacht via DocuSign, direkte DATEV-Integration.",
    results: [
      { metric: "12 Min.", label: "Ø Onboarding-Zeit (vorher: 3h)" },
      { metric: "0", label: "Manuelle Dateneingaben" },
      { metric: "95%", label: "Mandanten-Zufriedenheit" },
      { metric: "2 Wo.", label: "Implementierungsdauer" },
    ],
    services: ["Prozessautomatisierung", "API-Integration", "E-Mail-Automation"],
    featured: false,
  },
  {
    id: "handwerksbetrieb",
    category: "Handwerk",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "Sanitär & Heizung GmbH, Köln",
    subtitle: "Website & Lead-Generierung",
    description:
      "Ein Kölner Sanitärunternehmen mit 8 Mitarbeitern hatte eine veraltete Website ohne Kontaktformular und keinen Online-Präsenz. Aufträge kamen ausschließlich durch Mundpropaganda.",
    challenge:
      "Keine messbare Online-Präsenz, keine Möglichkeit für Interessenten, online Kontakt aufzunehmen. Gleichzeitig wuchsen die Mitbewerber mit Google-Werbung und modernen Websites.",
    solution:
      "Neue mobile-optimierte Website mit Online-Anfrage-Formular, Google My Business Optimierung, lokale SEO-Strategie und einfaches CRM für Anfragenverwaltung.",
    results: [
      { metric: "+240%", label: "Mehr Anfragen nach 3 Monaten" },
      { metric: "4,9/5", label: "Google-Bewertung" },
      { metric: "3 Wo.", label: "Projektdauer" },
      { metric: "80%", label: "Anfragen kommen digital" },
    ],
    services: ["Webentwicklung", "Lokales SEO", "Google My Business"],
    featured: false,
  },
  {
    id: "einzelhandel",
    category: "Einzelhandel",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "Sportartikelhandel, Stuttgart",
    subtitle: "E-Commerce Integration",
    description:
      "Ein regionaler Stuttgarter Sportartikelhandel wollte sein stationäres Geschäft um einen Online-Shop erweitern, ohne die bestehende Lagerverwaltung zu ersetzen.",
    challenge:
      "Vorhandenes Warenwirtschaftssystem sollte weiterlaufen, aber mit einem Online-Shop synchronisiert werden. Kein technisches Know-how intern verfügbar.",
    solution:
      "Shopify-Shop mit Middleware-Integration zur bestehenden Warenwirtschaft. Automatische Lagerbestandsynchronisation, Bestellabwicklung und Rechnungsversand.",
    results: [
      { metric: "28%", label: "Umsatzsteigerung nach 6 Monaten" },
      { metric: "350+", label: "Bestellungen/Monat online" },
      { metric: "4 Wo.", label: "Zeit bis zum Launch" },
      { metric: "0", label: "Doppelte Datenpflege" },
    ],
    services: ["E-Commerce", "API-Integration", "Prozessautomatisierung"],
    featured: false,
  },
  {
    id: "beratung",
    category: "Unternehmensberatung",
    categoryColor: "bg-gray-100 text-gray-700",
    title: "Management Consulting, Hamburg",
    subtitle: "Vertriebsdigitalisierung",
    description:
      "Eine Hamburger Unternehmensberatung generierte Leads ausschließlich über persönliche Netzwerke und Konferenzen. Kein systematischer digitaler Vertriebskanal.",
    challenge:
      "Hohe Abhängigkeit von persönlichen Kontakten, kein Skalierungspotenzial, kein CRM, keine E-Mail-Marketing-Strategie.",
    solution:
      "LinkedIn-Funnel mit Content-Strategie, HubSpot CRM-Einführung, automatisierte E-Mail-Nurturing-Sequenzen und monatliches Sales-Reporting-Dashboard.",
    results: [
      { metric: "15", label: "Qualifizierte Leads/Monat (neu)" },
      { metric: "35%", label: "Abschlussrate aus digitalen Leads" },
      { metric: "4×", label: "Pipeline-Wachstum in 6 Monaten" },
      { metric: "100%", label: "Pipeline-Transparenz" },
    ],
    services: ["Vertriebsdigitalisierung", "CRM-Einführung", "Content-Strategie"],
    featured: false,
  },
];

export default function ReferenzenPage() {
  const featuredProject = projects.find((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

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
              Referenzprojekte
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Keine Hochglanzversprechen — echte Projekte, echte Zahlen, echte Ergebnisse. Sehen Sie, wie wir für mittelständische Unternehmen in Deutschland messbare Digitalisierungserfolge erzielen.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="bg-white py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-[#C8911E] text-sm font-semibold uppercase tracking-wider mb-2">
              Highlight-Referenz
            </div>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-12">
              {featuredProject.title}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${featuredProject.categoryColor}`}>
                      {featuredProject.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0A1628] mb-3">{featuredProject.subtitle}</h3>
                  <p className="text-gray-500 leading-relaxed">{featuredProject.description}</p>
                </div>

                <div className="border-l-2 border-[#C8911E] pl-5">
                  <div className="text-sm font-semibold text-[#0A1628] mb-2">Herausforderung</div>
                  <p className="text-gray-500 text-sm leading-relaxed">{featuredProject.challenge}</p>
                </div>

                <div className="border-l-2 border-[#0A1628] pl-5">
                  <div className="text-sm font-semibold text-[#0A1628] mb-2">Unsere Lösung</div>
                  <p className="text-gray-500 text-sm leading-relaxed">{featuredProject.solution}</p>
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#0A1628] mb-4">Eingesetzte Leistungen</div>
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.services.map((s) => (
                      <span key={s} className="bg-[#F8F9FC] border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-[#0A1628] rounded-2xl p-6">
                  <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-6">Ergebnisse</div>
                  <div className="space-y-6">
                    {featuredProject.results.map((r) => (
                      <div key={r.label} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                        <div className="text-3xl font-bold text-gold-gradient mb-1">{r.metric}</div>
                        <div className="text-white/50 text-sm">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Projects Grid */}
      <section className="bg-[#F8F9FC] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="gold-divider mb-6" />
          <h2 className="text-2xl font-bold text-[#0A1628] mb-12">Weitere Projekte</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl p-8 border border-gray-100 card-hover">
                <div className="flex items-start justify-between mb-5">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${project.categoryColor}`}>
                    {project.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0A1628] mb-1">{project.title}</h3>
                <div className="text-[#C8911E] text-sm font-medium mb-3">{project.subtitle}</div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {project.results.slice(0, 2).map((r) => (
                    <div key={r.label} className="bg-[#F8F9FC] rounded-xl p-4">
                      <div className="text-xl font-bold text-[#C8911E] mb-0.5">{r.metric}</div>
                      <div className="text-gray-500 text-xs">{r.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.services.map((s) => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A1628] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ihr Unternehmen könnte das nächste sein
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
            Besprechen Sie Ihr Projekt in einem kostenlosen Erstgespräch. Kein Risiko, keine Verpflichtung.
          </p>
          <Link href="/kontakt" className="btn-primary">
            Kostenloses Erstgespräch buchen
          </Link>
        </div>
      </section>
    </>
  );
}
