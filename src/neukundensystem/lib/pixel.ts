// Meta Pixel für die Ads-Landingpages: Basiscode (PageView) auf allen Seiten, Lead nur auf der Danke-Seite.
// Geladen wird erst nach Marketing-Einwilligung.
import { CONSENT_EVENT, getMarketingConsent } from './consent';
import { clearPendingLead, getPendingLead } from './lead';
import { getAttribution } from './utm';

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

/**
 * Meta-Klick-ID sichern: Kommt die Einwilligung erst auf einer späteren Seite (z. B. der Danke-Seite),
 * steht die fbclid nicht mehr in der URL. Dann setzen wir das _fbc-Cookie im Meta-Format
 * (fb.1.<Zeit>.<fbclid>) aus der gemerkten fbclid, damit Meta den Lead der Anzeige zuordnen kann.
 * Läuft nur nach Einwilligung (aus initPixel).
 */
function ensureFbc(): void {
  try {
    if (/(?:^|;\s*)_fbc=/.test(document.cookie)) return;
    const fbclid = new URLSearchParams(window.location.search).get('fbclid') || getAttribution().fbclid;
    if (!fbclid) return;
    const host = window.location.hostname;
    const domain = host.endsWith('elevo.solutions') ? '; domain=.elevo.solutions' : '';
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `_fbc=fb.1.${Date.now()}.${encodeURIComponent(fbclid)}; path=/; max-age=${90 * 24 * 3600}; SameSite=Lax${domain}${secure}`;
  } catch {
    /* Cookies nicht verfügbar */
  }
}

// Events, die vor der Einwilligung passiert sind (z. B. Formular angefangen), werden nach der Zustimmung nachgereicht.
const pending: { name: string; custom: boolean; params: Record<string, unknown> }[] = [];

function flushPending(): void {
  const fbq = window.fbq;
  if (!fbq) return;
  for (const e of pending.splice(0)) fbq(e.custom ? 'trackCustom' : 'track', e.name, e.params);
}

/**
 * Zusatz-Event (z. B. ViewContent, FormStart, Schedule). Ohne Einwilligung wird es gemerkt und erst
 * nach der Zustimmung gesendet – ohne Zustimmung nie. Jedes Event höchstens einmal pro Seitenaufruf.
 */
const sent = new Set<string>();
export function trackEvent(name: string, params: Record<string, unknown> = {}, custom = false): void {
  if (sent.has(name)) return;
  sent.add(name);
  if (window.fbq && window.__lpPixelInit) window.fbq(custom ? 'trackCustom' : 'track', name, params);
  else pending.push({ name, custom, params });
}

/** Lädt den Basiscode und zählt einen PageView – höchstens einmal pro Seitenaufruf, nur mit Einwilligung. */
export function initPixel(pixelId: string): boolean {
  if (!isValidPixelId(pixelId) || getMarketingConsent() !== true) return false;
  const id = pixelId.trim();
  if (window.__lpPixelInit === id) return true;
  ensureFbc();
  const fbq = loadPixelBase();
  fbq('init', id);
  fbq('track', 'PageView');
  window.__lpPixelInit = id;
  flushPending();
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
 */
export function trackLeadIfAllowed(pixelId: string): boolean {
  if (tracked || !isValidPixelId(pixelId)) return false;
  if (getMarketingConsent() !== true) return false;
  const lead = getPendingLead();
  if (!lead) return false;

  initPixel(pixelId);
  window.fbq!('track', 'Lead', {}, { eventID: lead.eventId });
  clearPendingLead();
  tracked = true;
  return true;
}
