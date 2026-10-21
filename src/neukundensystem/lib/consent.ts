import { read, write } from './storage';

// Briefing-Schlüssel + Datum
const KEY = 'consent_marketing';
const DATE_KEY = 'consent_marketing_date';
// Einwilligung des Cookie-Banners auf dem Rest von elevo.solutions (gleiche Domain).
// Wird mitgelesen und mitgeschrieben, damit Besucher nur einmal gefragt werden.
const SITE_KEY = 'elevo_consent_v2';

export const CONSENT_EVENT = 'consent:change';
export const CONSENT_OPEN_EVENT = 'consent:open';

/** true = zugestimmt, false = nur notwendige, null = noch keine Auswahl */
export function getMarketingConsent(): boolean | null {
  const value = read('local', KEY);
  if (value === 'true') return true;
  if (value === 'false') return false;
  const site = read('local', SITE_KEY);
  if (!site) return null;
  try {
    return (JSON.parse(site) as { marketing?: unknown }).marketing === true;
  } catch {
    return null;
  }
}

/** „Alle akzeptieren“ = Marketing + Statistik, „Nur notwendige“ = beides aus – wie auf dem Rest der Website. */
export function setMarketingConsent(granted: boolean): void {
  write('local', KEY, String(granted));
  write('local', DATE_KEY, new Date().toISOString());
  write('local', SITE_KEY, JSON.stringify({ marketing: granted, analytics: granted }));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: granted }));
}
