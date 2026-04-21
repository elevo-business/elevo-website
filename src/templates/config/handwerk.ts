import type { BranchProfile } from './types';

export const handwerkProfile: BranchProfile = {
  id: 'handwerk',
  name: 'Handwerk & Baugewerbe',
  colorScheme: {
    accent: '#1D4ED8',
    accentHover: '#1E40AF',
    bg: '#F7F9FC',
    bgEl: '#EEF2F7',
    surface: '#E3EAF3',
    border: '#C8D6E5',
    text: '#1A1F2E',
    muted: '#5A6A8A',
    dim: '#8A9ABB',
  },
  typography: {
    heading: 'Sora',
    body: 'Outfit',
  },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'references' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: {
    style: 'craft',
    guidelines: 'Handwerker bei der Arbeit, Qualitätsdetails, Referenzbilder abgeschlossener Projekte, Vertrauens-Look',
  },
  tonality: 'Zuverlässig, qualitätsbewusst, transparent. Handwerk auf höchstem Niveau — Qualität vor Preis.',
};
