// Meta Pixel – wird ausschließlich von /danke importiert (Briefing, Abschnitt 5).
import { getMarketingConsent } from './consent';
import { clearPendingLead, getPendingLead } from './lead';

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let tracked = false;

export function isValidPixelId(id: string | undefined): id is string {
  return typeof id === 'string' && /^\d{8,20}$/.test(id.trim());
}

function loadPixelBase(): Fbq {
  if (window.fbq) return window.fbq;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  return fbq;
}

/**
 * Feuert genau ein Lead-Event, wenn
 *  1. eine gültige Pixel-ID konfiguriert ist,
 *  2. Marketing-Einwilligung vorliegt und
 *  3. ein erfolgreicher Formularversand höchstens 30 Minuten zurückliegt.
 * Danach wird der Versand-Marker gelöscht, damit Neuladen keinen zweiten Lead zählt.
 */
export function trackLeadIfAllowed(pixelId: string): boolean {
  if (tracked || !isValidPixelId(pixelId)) return false;
  if (getMarketingConsent() !== true) return false;
  const lead = getPendingLead();
  if (!lead) return false;

  const fbq = loadPixelBase();
  fbq('init', pixelId.trim());
  fbq('track', 'PageView');
  fbq('track', 'Lead', {}, { eventID: lead.eventId });
  clearPendingLead();
  tracked = true;
  return true;
}
