import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — ELEVO",
};

export default function DatenschutzPage() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#0A1628] mb-8">Datenschutzerklärung</h1>
        <div className="text-gray-600 text-sm leading-relaxed space-y-6">
          <div>
            <h2 className="font-semibold text-[#0A1628] mb-2">1. Verantwortlicher</h2>
            <p>
              Verantwortlicher im Sinne der DSGVO ist ELEVO GmbH, Musterstraße 1, 60311 Frankfurt am Main, hallo@elevo.de.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-[#0A1628] mb-2">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
            <p>
              Wir erheben personenbezogene Daten nur, wenn Sie uns diese im Rahmen eines Kontaktformulars oder bei der Buchung eines Gesprächstermins freiwillig mitteilen. Wir verwenden Ihre Daten ausschließlich zur Bearbeitung Ihrer Anfrage.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-[#0A1628] mb-2">3. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten sowie das Recht auf Datenübertragbarkeit. Wenden Sie sich dazu an hallo@elevo.de.
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-8">
            Stand: April 2026. Diese Datenschutzerklärung ist ein Entwurf für Demonstrationszwecke.
          </p>
        </div>
      </div>
    </section>
  );
}
