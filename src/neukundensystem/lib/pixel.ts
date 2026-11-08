// Meta Pixel für die Ads-Landingpages: Basiscode (PageView) auf allen Seiten, Lead nur auf der Danke-Seite.
// Geladen wird erst nach Marketing-Einwilligung.
import { CONSENT_EVENT, getMarketingConsent } from './consent';
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
    __lpPixelInit?: string;
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

/** Lädt den Basiscode und zählt einen PageView – höchstens einmal pro Seitenaufruf, nur mit Einwilligung. */
export function initPixel(pixelId: string): boolean {
  if (!isValidPixelId(pixelId) || getMarketingConsent() !== true) return false;
  const id = pixelId.trim();
  if (window.__lpPixelInit === id) return true;
  const fbq = loadPixelBase();
  fbq('init', id);
  fbq('track', 'PageView');
  window.__lpPixelInit = id;
  return true;
}

/** PageView sofort (wenn schon zugestimmt) oder sobald im Banner zugestimmt wird. */
export function startPixel(pixelId: string): void {
  initPixel(pixelId);
  window.addEventListener(CONSENT_EVENT, (event) => {
    if ((event as CustomEvent<boolean>).detail === true) initPixel(pixelId);
  });
}

/**
 * Feuert genau ein Lead-Event, wenn
 *  1. eine gültige Pixel-ID konfiguriert ist,
 *  2. Marketing-Einwilligung vorliegt und
 *  3. ein erfolgreicher Formularversand höchstens 30 Minuten zurückliegt.
 * Danach wird der Versand-Marker gelöscht, damit Neuladen keinen zweiten Lead zählt.
 *
 * `contentName` kennzeichnet die Landingpage (z. B. "kanzlei-berlin"), damit im
 * Events Manager sichtbar ist, von welcher Seite ein Lead kam – unabhängig davon,
 * welcher Anzeige Meta ihn zuordnet.
 */
export function trackLeadIfAllowed(pixelId: string, contentName?: string): boolean {
  if (tracked || !isValidPixelId(pixelId)) return false;
  if (getMarketingConsent() !== true) return false;
  const lead = getPendingLead();
  if (!lead) return false;

  initPixel(pixelId);
  window.fbq!('track', 'Lead', contentName ? { content_name: contentName } : {}, { eventID: lead.eventId });
  clearPendingLead();
  tracked = true;
  return true;
}
