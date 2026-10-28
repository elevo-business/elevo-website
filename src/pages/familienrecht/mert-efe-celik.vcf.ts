// „Nummer speichern“ auf der Danke-Seite: wird beim Build als statische .vcf-Datei erzeugt
import type { APIRoute } from 'astro';
import fr from '../../config/familienrecht.json';
import { buildVcard } from '../../familienrecht/lib/vcard';

export const GET: APIRoute = () =>
  new Response(
    buildVcard({
      name: fr.thankYou.vcardName,
      org: fr.thankYou.vcardOrg,
      phone: fr.thankYou.phoneInternational || fr.thankYou.phone,
    }),
    { headers: { 'Content-Type': 'text/vcard; charset=utf-8' } },
  );
