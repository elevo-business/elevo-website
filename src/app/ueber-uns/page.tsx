import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Über uns — ELEVO Digitalagentur",
  description:
    "ELEVO ist die Digitalagentur für den deutschen Mittelstand. Lernen Sie unser Team und unsere Mission kennen.",
};

const values = [
  {
    title: "Klarheit statt Buzzwords",
    description:
      "Wir sprechen kein Tech-Chinesisch. Sie bekommen klare Aussagen darüber, was wir tun, warum, und was es bringt.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    title: "Ergebnisse, keine Ausreden",
    description:
      "Wir messen alles. Jede Maßnahme hat ein Ziel, ein KPI, eine Auswertung. Keine Kaffeesatz-Versprechen.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Langfristige Partnerschaft",
    description:
      "Wir wollen kein Einmalkunde. Wir wollen langfristig Ihr digitaler Wachstumspartner sein — und wachsen, wenn Sie wachsen.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
  },
  {
    title: "Qualität ohne Kompromisse",
    description:
      "10k€+ Qualitätsanspruch ist unser Mindeststandard, nicht unser Höchstziel. Jedes Projekt liefern wir mit Stolz aus.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

const whyUs = [
  { label: "Branchen-Expertise", value: "Mittelstand DE", desc: "Wir kennen die Herausforderungen des deutschen Mittelstands aus erster Hand." },
  { label: "Transparenz", value: "Festpreis", desc: "Keine versteckten Kosten, kein Scope Creep. Klare Vereinbarungen." },
  { label: "Speed", value: "< 4 Wochen", desc: "Erste Ergebnisse in Wochen, nicht Monaten." },
  { label: "Fokus", value: "3 Kernleistungen", desc: "Wir sind keine Generalisten. Wir sind Spezialisten in drei Bereichen." },
];

export default function UeberUnsPage() {
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
              Wer wir sind
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              ELEVO ist eine Digitalagentur, die sich auf mittelständische Unternehmen in Deutschland spezialisiert hat. Unser Ziel: den deutschen Mittelstand digital fit für die Zukunft machen.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-5">
                Unsere Mission
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Der deutsche Mittelstand ist das Rückgrat unserer Wirtschaft — aber er ist digital oft im Rückstand. Großkonzerne investieren Millionen in Digitalisierung, während viele mittelständische Betriebe mit veralteten Prozessen, schwachen Online-Auftritten und nicht-ausgeschöpftem Vertriebspotenzial kämpfen.
              </p>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                <strong className="text-[#0A1628]">Das wollen wir ändern.</strong> Mit praxiserprobten Lösungen, transparenten Prozessen und einem Team, das versteht, wie Mittelstandsunternehmen wirklich ticken.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/kontakt" className="btn-primary">
                  Gespräch anfragen
                </Link>
                <Link href="/referenzen" className="btn-outline">
                  Referenzen ansehen
                </Link>
              </div>
            </div>

            <div className="bg-[#F8F9FC] rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { v: "2022", l: "Gründungsjahr" },
                  { v: "40+", l: "Abgeschlossene Projekte" },
                  { v: "95%", l: "Weiterempfehlungsrate" },
                  { v: "12+", l: "Branchen betreut" },
                ].map((item) => (
                  <div key={item.l} className="text-center py-4">
                    <div className="text-3xl font-bold text-gold-gradient mb-1">{item.v}</div>
                    <div className="text-gray-500 text-sm">{item.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F8F9FC] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] mb-4">
              Wie wir arbeiten
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Diese Prinzipien leiten jede Entscheidung, die wir für unsere Kunden treffen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-8 border border-gray-100 card-hover flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#FDF4E3] text-[#C8911E] flex items-center justify-center flex-shrink-0">
                  {value.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#0A1628] mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ELEVO */}
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
              Warum ELEVO?
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Was uns von anderen Digitalagenturen unterscheidet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => (
              <div key={item.label} className="bg-white/6 border border-white/12 rounded-2xl p-6">
                <div className="text-[#C8911E] text-xs font-semibold uppercase tracking-wider mb-2">{item.label}</div>
                <div className="text-2xl font-bold text-white mb-3">{item.value}</div>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0A1628] mb-4">
            Lernen Sie uns persönlich kennen
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            Buchen Sie ein kostenloses 30-Minuten-Erstgespräch. Kein Pitch, kein Druck — nur ein offenes Gespräch über Ihre Situation.
          </p>
          <Link href="/kontakt" className="btn-primary">
            Erstgespräch vereinbaren
          </Link>
        </div>
      </section>
    </>
  );
}
