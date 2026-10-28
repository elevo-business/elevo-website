// vCard für „Nummer speichern“ auf der Danke-Seite (wird beim Build als .vcf-Datei erzeugt)
interface VcardData {
  name: string;
  org: string;
  phone: string;
}

const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

export function buildVcard({ name, org, phone }: VcardData): string {
  const parts = name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts.pop()! : '';
  const first = parts.join(' ');
  const tel = phone.replace(/[^\d+]/g, '');
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escape(last)};${escape(first)};;;`,
    `FN:${escape(name)}`,
    `ORG:${escape(org)}`,
    `TEL;TYPE=WORK,VOICE:${tel}`,
    'END:VCARD',
    '',
  ].join('\r\n');
}
