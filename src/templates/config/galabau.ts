import type { BranchProfile } from './types';

export const galabauProfile: BranchProfile = {
  id: 'galabau',
  name: 'Garten- und Landschaftsbau',
  colorScheme: {
    accent: '#2D7A3A',
    accentHover: '#1E6B2B',
    bg: '#FAFDF7',
    bgEl: '#F3F8F0',
    surface: '#EAF2E5',
    border: '#D0DFC8',
    text: '#1A2E1A',
    muted: '#5A7A5A',
    dim: '#8AAB8A',
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
