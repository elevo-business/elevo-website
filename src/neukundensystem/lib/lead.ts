import { read, remove, write } from './storage';

// Schlüssel laut Briefing, Abschnitt 4 + 5
export const LEAD_SUBMITTED = 'lead_submitted';
export const LEAD_EVENT_ID = 'lead_event_id';
export const LEAD_VORNAME = 'lead_vorname';
export const LEAD_WINDOW_MS = 30 * 60 * 1000;

export function markLeadSubmitted(vorname: string, eventId: string): void {
  write('session', LEAD_SUBMITTED, String(Date.now()));
  write('session', LEAD_EVENT_ID, eventId);
  write('session', LEAD_VORNAME, vorname);
}

/** Liefert die eventID, wenn ein erfolgreicher Versand höchstens 30 Minuten zurückliegt. */
export function getPendingLead(): { eventId: string } | null {
  const submittedAt = Number(read('session', LEAD_SUBMITTED));
  const eventId = read('session', LEAD_EVENT_ID);
  if (!submittedAt || !eventId) return null;
  const age = Date.now() - submittedAt;
  if (age < 0 || age > LEAD_WINDOW_MS) {
    clearPendingLead();
    return null;
  }
  return { eventId };
}

export function clearPendingLead(): void {
  remove('session', LEAD_SUBMITTED);
  remove('session', LEAD_EVENT_ID);
}

export function getLeadVorname(): string {
  return (read('session', LEAD_VORNAME) ?? '').trim();
}
