// „Nummer speichern“ auf der Danke-Seite: wird beim Build als statische .vcf-Datei erzeugt
import type { APIRoute } from 'astro';
import kb from '../../config/kanzlei-berlin.json';
import { buildVcard } from '../../familienrecht/lib/vcard';

export const GET: APIRoute = () =>
  new Response(
    buildVcard({
      name: kb.thankYou.vcardName,
      org: kb.thankYou.vcardOrg,
      phone: kb.thankYou.phoneInternational || kb.thankYou.phone,
    }),
    { headers: { 'Content-Type': 'text/vcard; charset=utf-8' } },
  );
