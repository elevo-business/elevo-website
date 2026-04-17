"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const contactMethods = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: "Telefon",
    value: "+49 (0) 69 123 456 78",
    sublabel: "Mo–Fr, 9–18 Uhr",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "E-Mail",
    value: "hallo@elevo.de",
    sublabel: "Antwort innerhalb von 24h",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: "Standort",
    value: "Frankfurt am Main",
    sublabel: "Deutschlandweit tätig",
  },
];

const services = [
  "Webentwicklung",
  "Prozessautomatisierung",
  "Vertriebsdigitalisierung",
  "Strategieberatung",
  "Sonstiges",
];

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "YOUR_WEB3FORMS_KEY",
          subject: `Neue Anfrage von ${formData.name} — ELEVO`,
          from_name: "ELEVO Website",
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Fehler beim Senden. Bitte versuchen Sie es erneut.");
      }
    } catch {
      alert("Netzwerkfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

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
              Kontakt
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Bereit für den nächsten Schritt? Schreiben Sie uns oder buchen Sie direkt ein kostenloses 30-Minuten-Erstgespräch.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-[#F8F9FC] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Info */}
            <div>
              <h2 className="text-xl font-bold text-[#0A1628] mb-6">So erreichen Sie uns</h2>

              <div className="space-y-6 mb-10">
                {contactMethods.map((method) => (
                  <div key={method.label} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#FDF4E3] text-[#C8911E] flex items-center justify-center flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                        {method.label}
                      </div>
                      <div className="font-semibold text-[#0A1628] text-sm">{method.value}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{method.sublabel}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* What to expect */}
              <div className="bg-[#0A1628] rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-5">Was passiert nach Ihrer Anfrage?</h3>
                <ol className="space-y-4">
                  {[
                    { n: "1", t: "Bestätigung", d: "Sie erhalten innerhalb von 2h eine Eingangsbestätigung von uns." },
                    { n: "2", t: "Erstgespräch", d: "Wir melden uns innerhalb von 24h, um ein Kennenlern-Gespräch zu vereinbaren." },
                    { n: "3", t: "Angebot", d: "Nach dem Gespräch erhalten Sie ein maßgeschneidertes Angebot." },
                  ].map((step) => (
                    <li key={step.n} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full border border-[#E8A835] text-[#E8A835] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {step.n}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{step.t}</div>
                        <div className="text-white/40 text-xs mt-0.5 leading-relaxed">{step.d}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-100 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#0A1628] mb-3">Anfrage erhalten!</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                      Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von 24 Stunden bei Ihnen. Bis bald!
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-[#0A1628] mb-8">Anfrage senden</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Ihr Name <span className="text-[#C8911E]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Max Mustermann"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A1628] placeholder-gray-400 focus:outline-none focus:border-[#C8911E] focus:ring-1 focus:ring-[#C8911E] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Unternehmen
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Mustermann GmbH"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A1628] placeholder-gray-400 focus:outline-none focus:border-[#C8911E] focus:ring-1 focus:ring-[#C8911E] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            E-Mail <span className="text-[#C8911E]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="max@mustermann.de"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A1628] placeholder-gray-400 focus:outline-none focus:border-[#C8911E] focus:ring-1 focus:ring-[#C8911E] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Telefon
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+49 (0) 69 ..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A1628] placeholder-gray-400 focus:outline-none focus:border-[#C8911E] focus:ring-1 focus:ring-[#C8911E] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Welche Leistung interessiert Sie?
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A1628] focus:outline-none focus:border-[#C8911E] focus:ring-1 focus:ring-[#C8911E] transition-colors bg-white"
                        >
                          <option value="">Bitte wählen...</option>
                          {services.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Ungefähres Budget
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A1628] focus:outline-none focus:border-[#C8911E] focus:ring-1 focus:ring-[#C8911E] transition-colors bg-white"
                        >
                          <option value="">Keine Angabe</option>
                          <option value="<5000">Unter 5.000 €</option>
                          <option value="5000-10000">5.000 – 10.000 €</option>
                          <option value="10000-25000">10.000 – 25.000 €</option>
                          <option value=">25000">Über 25.000 €</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Ihr Anliegen <span className="text-[#C8911E]">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Beschreiben Sie kurz Ihre aktuelle Situation und was Sie erreichen möchten..."
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A1628] placeholder-gray-400 focus:outline-none focus:border-[#C8911E] focus:ring-1 focus:ring-[#C8911E] transition-colors resize-none"
                        />
                      </div>

                      <div className="flex items-start gap-3 pt-1">
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Mit dem Absenden stimmen Sie zu, dass wir Ihre Daten zur Bearbeitung Ihrer Anfrage verwenden. Ihre Daten werden nicht an Dritte weitergegeben. Weitere Informationen finden Sie in unserer{" "}
                          <a href="/datenschutz" className="text-[#C8911E] hover:underline">
                            Datenschutzerklärung
                          </a>
                          .
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full text-center disabled:opacity-70"
                      >
                        {submitting ? "Wird gesendet..." : "Anfrage absenden"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
