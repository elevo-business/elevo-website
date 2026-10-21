// Versand an die HubSpot Forms API (Briefing, Abschnitt 4)
export interface HubspotConfig {
  portalId: string;
  formGuid: string;
  communications?: { value: boolean; subscriptionTypeId: number; text: string }[];
}

export interface HubspotField {
  name: string;
  value: string;
}

const ID_PATTERN = /^[A-Za-z0-9-]+$/;

export function isHubspotConfigured(config: HubspotConfig): boolean {
  return ID_PATTERN.test(config.portalId) && ID_PATTERN.test(config.formGuid);
}

function getHutk(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export async function submitToHubspot(
  config: HubspotConfig,
  fields: HubspotField[],
  consentText: string,
): Promise<boolean> {
  if (!isHubspotConfigured(config)) {
    console.warn('HubSpot: portalId/formGuid sind in src/config/site.json noch nicht eingetragen.');
    return false;
  }
  const hutk = getHutk();
  const body = {
    submittedAt: Date.now(),
    fields: fields.filter((f) => f.name && f.value !== ''),
    context: {
      pageUri: window.location.href,
      pageName: document.title,
      ...(hutk ? { hutk } : {}),
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: consentText,
        ...(config.communications?.length ? { communications: config.communications } : {}),
      },
    },
  };

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(config.portalId)}/${encodeURIComponent(config.formGuid)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      console.warn('HubSpot-Antwort', response.status, await response.text().catch(() => ''));
    }
    return response.ok;
  } catch (error) {
    console.warn('HubSpot-Versand fehlgeschlagen', error);
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}
