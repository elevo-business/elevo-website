import type { BranchProfile } from './types';

export const maklerProfile: BranchProfile = {
  id: 'makler',
  name: 'Immobilien & Makler',
  colorScheme: {
    accent: '#C9A84C',
    accentHover: '#A88830',
    bg: '#080706',
    bgEl: '#0E0C0A',
    surface: '#141210',
    border: '#251F18',
    text: '#F5EFE0',
    muted: '#9C8B6A',
    dim: '#5C4F38',
  },
  typography: {
    heading: 'Sora',
    body: 'Outfit',
  },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'property-showcase' } },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: {
    style: 'premium',
    guidelines: 'Premium-Immobilien, hochwertige Architektur, Objektgalerien mit Innen- und Außenaufnahmen, Gold-Akzente',
  },
  tonality: 'Exklusiv, diskret, vertrauenswürdig. Premiumanspruch ohne Übertreibung — professionell und persönlich.',
};
