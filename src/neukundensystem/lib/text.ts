// Hilfen für Texte aus site.json
const PLACEHOLDER = /\[[^\]]+\]/;

/** true, wenn der Text echten Inhalt hat (nicht leer und kein [Platzhalter]). */
export function isFilled(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim() !== '' && !PLACEHOLDER.test(value);
}

export function hasPlaceholder(value: string | null | undefined): boolean {
  return typeof value === 'string' && PLACEHOLDER.test(value);
}

/** Ersetzt {{schluessel}} durch Werte. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? '');
}

/** Wandelt eine Telefonnummer in einen tel:-Link um (nur Ziffern und führendes +). */
export function telHref(phone: string): string | null {
  if (!isFilled(phone)) return null;
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.length >= 6 ? `tel:${cleaned}` : null;
}
