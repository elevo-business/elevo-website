import type { BranchProfile } from './types';

export const galabauProfile: BranchProfile = {
  id: 'galabau',
  name: 'Garten- und Landschaftsbau',
  colorScheme: {
    accent: '#16A34A',
    accentHover: '#15803D',
    bg: '#050E07',
    bgEl: '#061209',
    surface: '#0A1C0D',
    border: '#132B17',
    text: '#E2F5EA',
    muted: '#6BA07A',
    dim: '#3D6B4A',
  },
  typography: {
    heading: 'Sora',
    body: 'Outfit',
  },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'before-after' } },
    { type: 'stats', enabled: true },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: {
    style: 'nature',
    guidelines: 'Natur-Bildsprache, satte Grüntöne, gepflegte Gärten und Parks, Vorher/Nachher-Ansichten',
  },
  tonality: 'Bodenständig, kompetent, naturverbunden. Regionale Verwurzelung betonen.',
};
