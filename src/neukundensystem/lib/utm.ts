import { read, write } from './storage';

export const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;
export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>;

const STORAGE_KEY = 'lp_attribution';

/** Liest UTM-Parameter und fbclid beim ersten Aufruf mit Parametern aus der URL und merkt sie sich für die Sitzung. */
export function captureAttribution(): void {
  if (read('session', STORAGE_KEY)) return;
  const params = new URLSearchParams(window.location.search);
  const data: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) data[key] = value.slice(0, 500);
  }
  if (Object.keys(data).length > 0) write('session', STORAGE_KEY, JSON.stringify(data));
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(read('session', STORAGE_KEY) ?? '{}') as Attribution;
  } catch {
    return {};
  }
}
