// Sicherer Zugriff auf sessionStorage/localStorage: In privaten Fenstern oder bei
// blockierten Website-Daten werfen die Zugriffe – dann arbeiten wir ohne Speicher weiter.
type Area = 'session' | 'local';

function area(which: Area): Storage | null {
  try {
    return which === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function read(which: Area, key: string): string | null {
  try {
    return area(which)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function write(which: Area, key: string, value: string): void {
  try {
    area(which)?.setItem(key, value);
  } catch {
    /* Speicher nicht verfügbar */
  }
}

export function remove(which: Area, key: string): void {
  try {
    area(which)?.removeItem(key);
  } catch {
    /* Speicher nicht verfügbar */
  }
}

export function uuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}
