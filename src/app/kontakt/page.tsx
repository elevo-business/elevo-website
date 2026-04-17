"use client";

import { useState } from "react";

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
    value: "hallo@elevo.solutions",
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
  { id: "webentwicklung", label: "Webentwicklung", icon: "🖥️", desc: "Website, Landingpage oder Web-App" },
  { id: "prozessautomatisierung", label: "Prozessautomatisierung", icon: "⚙️", desc: "Workflows, CRM, Integrationen" },
  { id: "vertriebsdigitalisierung", label: "Vertriebsdigitalisierung", icon: "📈", desc: "Funnel, Leads, Sales-Dashboard" },
  { id: "beratung", label: "Strategieberatung", icon: "💡", desc: "Analyse & Digitalstrategie" },
  { id: "sonstiges", label: "Sonstiges", icon: "✉️", desc: "Anderes Anliegen" },
];

const budgets = [
  { id: "<5000", label: "< 5.000 €" },
  { id: "5000-10000", label: "5.000 – 10.000 €" },
  { id: "10000-25000", label: "10.000 – 25.000 €" },
  { id: ">25000", label: "> 25.000 €" },
  { id: "unbekannt", label: "Noch unklar" },
];

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#0A1628] placeholder-gray-400 focus:outline-none focus:border-[#C8911E] focus:ring-1 focus:ring-[#C8911E] transition-colors";

export default function KontaktPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    budget: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof formData, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error ?? "Unbekannter Fehler. Bitte erneut versuchen.");
      }
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed1 = !!formData.service;
  const canProceed2 = !!formData.name && !!formData.email && !!formData.message;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] py-24 lg:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="gold-divider mb-8" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Kontakt</h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Bereit für den nächsten Schritt? Erzählen Sie uns von Ihrem Projekt — wir melden uns innerhalb von 24 Stunden.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-[#F8F9FC] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Sidebar */}
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

              <div className="bg-[#0A1628] rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-5">Was passiert nach Ihrer Anfrage?</h3>
                <ol className="space-y-4">
                  {[
                    { n: "1", t: "Bestätigung", d: "Eingangsbestätigung innerhalb von 2h." },
                    { n: "2", t: "Erstgespräch", d: "Wir melden uns innerhalb von 24h für ein Kennenlerngespräch." },
                    { n: "3", t: "Angebot", d: "Sie erhalten ein maßgeschneidertes Angebot." },
                  ].map((s) => (
                    <li key={s.n} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full border border-[#E8A835] text-[#E8A835] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {s.n}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{s.t}</div>
                        <div className="text-white/40 text-xs mt-0.5 leading-relaxed">{s.d}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Form */}
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
                      Vielen Dank, {formData.name}. Wir melden uns innerhalb von 24 Stunden. Bis bald!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Progress bar */}
                    <div className="flex items-center gap-3 mb-8">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex items-center gap-3 flex-1 last:flex-none">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                              step > n
                                ? "bg-[#C8911E] text-white"
                                : step === n
                                ? "bg-[#0A1628] text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {step > n ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              n
                            )}
                          </div>
                          <span className={`text-xs font-medium hidden sm:block ${step === n ? "text-[#0A1628]" : "text-gray-400"}`}>
                            {n === 1 ? "Leistung" : n === 2 ? "Ihre Daten" : "Nachricht"}
                          </span>
                          {n < 3 && <div className={`flex-1 h-px ${step > n ? "bg-[#C8911E]" : "bg-gray-200"}`} />}
                        </div>
                      ))}
                    </div>

                    {/* Step 1: Service selection */}
                    {step === 1 && (
                      <div>
                        <h2 className="text-xl font-bold text-[#0A1628] mb-2">Was interessiert Sie?</h2>
                        <p className="text-gray-400 text-sm mb-6">Wählen Sie den Bereich, in dem Sie Unterstützung suchen.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                          {services.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => set("service", s.id)}
                              className={`text-left p-4 rounded-xl border-2 transition-all ${
                                formData.service === s.id
                                  ? "border-[#C8911E] bg-[#FDF4E3]"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="text-xl mb-1">{s.icon}</div>
                              <div className="font-semibold text-[#0A1628] text-sm">{s.label}</div>
                              <div className="text-gray-400 text-xs mt-0.5">{s.desc}</div>
                            </button>
                          ))}
                        </div>
                        <div className="mb-6">
                          <p className="text-sm font-medium text-gray-700 mb-3">Ungefähres Budget (optional)</p>
                          <div className="flex flex-wrap gap-2">
                            {budgets.map((b) => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => set("budget", b.id)}
                                className={`text-sm px-4 py-2 rounded-full border transition-all ${
                                  formData.budget === b.id
                                    ? "border-[#C8911E] bg-[#C8911E] text-white"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                }`}
                              >
                                {b.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={!canProceed1}
                          onClick={() => setStep(2)}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Weiter →
                        </button>
                      </div>
                    )}

                    {/* Step 2: Contact info */}
                    {step === 2 && (
                      <div>
                        <h2 className="text-xl font-bold text-[#0A1628] mb-2">Ihre Kontaktdaten</h2>
                        <p className="text-gray-400 text-sm mb-6">Damit wir Sie erreichen können.</p>
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Name <span className="text-[#C8911E]">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => set("name", e.target.value)}
                                placeholder="Max Mustermann"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Unternehmen</label>
                              <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => set("company", e.target.value)}
                                placeholder="Mustermann GmbH"
                                className={inputClass}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                E-Mail <span className="text-[#C8911E]">*</span>
                              </label>
                              <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => set("email", e.target.value)}
                                placeholder="max@mustermann.de"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => set("phone", e.target.value)}
                                placeholder="+49 (0) 69 ..."
                                className={inputClass}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="btn-outline"
                          >
                            ← Zurück
                          </button>
                          <button
                            type="button"
                            disabled={!formData.name || !formData.email}
                            onClick={() => setStep(3)}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Weiter →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Message + submit */}
                    {step === 3 && (
                      <div>
                        <h2 className="text-xl font-bold text-[#0A1628] mb-2">Ihr Anliegen</h2>
                        <p className="text-gray-400 text-sm mb-6">
                          Beschreiben Sie kurz Ihre Situation und was Sie erreichen möchten.
                        </p>

                        {/* Summary */}
                        <div className="bg-[#F8F9FC] rounded-xl p-4 mb-5 flex flex-wrap gap-3">
                          <span className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                            {services.find((s) => s.id === formData.service)?.label}
                          </span>
                          {formData.budget && (
                            <span className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                              {budgets.find((b) => b.id === formData.budget)?.label}
                            </span>
                          )}
                          <span className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                            {formData.name}
                          </span>
                          {formData.company && (
                            <span className="bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                              {formData.company}
                            </span>
                          )}
                        </div>

                        <textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="Erzählen Sie uns von Ihrem Unternehmen und was Sie sich von der Zusammenarbeit erhoffen..."
                          className={inputClass + " resize-none"}
                        />

                        <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                          Mit dem Absenden stimmen Sie zu, dass wir Ihre Daten zur Bearbeitung Ihrer Anfrage verwenden.{" "}
                          <a href="/datenschutz" className="text-[#C8911E] hover:underline">
                            Datenschutz
                          </a>
                          .
                        </p>

                        {error && (
                          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                            {error}
                          </div>
                        )}

                        <div className="flex gap-3 mt-6">
                          <button type="button" onClick={() => setStep(2)} className="btn-outline">
                            ← Zurück
                          </button>
                          <button
                            type="button"
                            disabled={!canProceed2 || submitting}
                            onClick={handleSubmit}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? "Wird gesendet..." : "Anfrage absenden"}
                          </button>
                        </div>
                      </div>
                    )}
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
