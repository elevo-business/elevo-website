import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — ELEVO",
};

export default function ImpressumPage() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#0A1628] mb-8">Impressum</h1>
        <div className="prose prose-gray max-w-none text-gray-600 text-sm leading-relaxed space-y-4">
          <p><strong>ELEVO GmbH</strong></p>
          <p>
            Musterstraße 1<br />
            60311 Frankfurt am Main<br />
            Deutschland
          </p>
          <p>
            Telefon: +49 (0) 69 123 456 78<br />
            E-Mail: hallo@elevo.de
          </p>
          <p>
            Handelsregister: HRB 12345<br />
            Registergericht: Amtsgericht Frankfurt am Main
          </p>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
            DE123456789
          </p>
          <p>
            <strong>Geschäftsführer:</strong> Max Mustermann
          </p>
          <p className="text-xs text-gray-400 mt-8">
            Angaben gemäß § 5 TMG. Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Max Mustermann, Anschrift wie oben.
          </p>
        </div>
      </div>
    </section>
  );
}
