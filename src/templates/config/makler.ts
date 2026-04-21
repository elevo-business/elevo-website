import type { BranchProfile } from './types';

export const maklerProfile: BranchProfile = {
  id: 'makler',
  name: 'Immobilien & Makler',
  colorScheme: {
    accent: '#B8960C',
    accentHover: '#9A7D0A',
    bg: '#FAF8F5',
    bgEl: '#F2EDE5',
    surface: '#E8E0D3',
    border: '#D4C9B5',
    text: '#1E1A14',
    muted: '#6B5F4A',
    dim: '#9A8E78',
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
