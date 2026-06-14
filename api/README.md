# Elevo Lead-Proxy + Meta Conversions API

Serverseitiger Proxy für das Kontaktformular (`src/components/ContactForm.astro`).
Vorbild: `api/lead.php` im **greenchild**-Repo. Macht zwei Dinge pro Submit:

1. **Pipedrive** — legt Person + Lead + Notiz an (Token bleibt serverseitig).
2. **Meta Conversions API** — meldet das `Lead`-Event serverseitig (robust gegen
   Adblocker/ITP). Deduplizierung mit dem Browser-Pixel über dieselbe `event_id`.

## Architektur

```
Browser (elevo.solutions)                 api.elevo.solutions (dieser Container)
  ContactForm.astro                          api/contact.php
   ├─ fbq('track','Lead',{eventID})  ──┐       ├─ Pipedrive: Person/Lead/Notiz
   └─ POST /api/contact {…, event_id} ─┴──────▶ └─ Meta CAPI: 'Lead' (event_id = Dedup)
```

> Website und API liegen auf **verschiedenen Subdomains** → der Proxy setzt
> CORS-Header und beantwortet den OPTIONS-Preflight (Whitelist in `contact.php`).

## Deployment (Coolify)

Eigene Coolify-App, getrennt von der Website:

- **Source**: dieses Repo, **Base Directory** `api`, **Dockerfile** `Dockerfile`
- **Domain**: `api.elevo.solutions`
- **Environment Variables** (Tokens NICHT ins Repo committen):
  | Variable | Pflicht | Beschreibung |
  |----------|---------|--------------|
  | `PIPEDRIVE_API_TOKEN` | ✅ | Pipedrive-API-Token |
  | `META_CAPI_TOKEN` | ✅ | Meta Conversions-API Access-Token |
  | `META_PIXEL_ID` | ✅ | Pixel-/Dataset-ID (darf öffentlich sein) |
  | `META_TEST_EVENT_CODE` | — | nur zum Testen im Events Manager |

Ohne gesetzte Tokens wird der jeweilige Schritt still übersprungen (Formular
antwortet trotzdem mit `success`), damit ein fehlendes Secret das Formular nicht
blockiert.

## Selbsttest

```
GET https://api.elevo.solutions/api/contact?selftest=elevo-diag-2026
```

Liefert den Config-Status (Token geladen? gültig? Pixel gesetzt?) **ohne** Secrets
auszugeben. Sendet dabei ein harmloses `SelfTest`-Event an Meta und prüft den
Pipedrive-Token live über `/users/me`.

## Wichtig

- `META_PIXEL_ID` muss mit der ID in `BaseLayout.astro` (`META_PIXEL_ID`-Konstante)
  übereinstimmen, sonst greift die Pixel/CAPI-Deduplizierung nicht.
- Token-Rotation: Werte nur in Coolify-Env-Vars ändern, nie im Code.
