// „Nummer speichern“ auf /danke: wird beim Build als statische .vcf-Datei erzeugt
import type { APIRoute } from 'astro';
import ss from '../config/startseite.json';
import { buildVcard } from '../familienrecht/lib/vcard';

export const GET: APIRoute = () =>
  new Response(
    buildVcard({ name: ss.thankYou.vcardName, org: ss.thankYou.vcardOrg, phone: ss.thankYou.phoneInternational || ss.thankYou.phone }),
    { headers: { 'Content-Type': 'text/vcard; charset=utf-8' } },
  );
