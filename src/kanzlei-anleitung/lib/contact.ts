// Kontaktdaten aus dem Opt-in für die Sitzung merken, damit das Formular unter dem Video
// sie nicht noch einmal abfragen muss. sessionStorage endet mit dem Tab.
import { read, write } from '../../neukundensystem/lib/storage';

export interface Contact {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

const KEY = 'ka_contact';

export function saveContact(contact: Contact): void {
  write('session', KEY, JSON.stringify(contact));
}

export function getContact(): Contact | null {
  try {
    const c = JSON.parse(read('session', KEY) ?? 'null') as Contact | null;
    return c && c.email && c.phone ? c : null;
  } catch {
    return null;
  }
}
