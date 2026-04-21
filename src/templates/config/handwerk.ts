import type { BranchProfile } from './types';

export const handwerkProfile: BranchProfile = {
  id: 'handwerk',
  name: 'Handwerk & Baugewerbe',
  colorScheme: {
    accent: '#2563EB',
    accentHover: '#1D4ED8',
    bg: '#060912',
    bgEl: '#080D1A',
    surface: '#0C1221',
    border: '#141E36',
    text: '#E8EEFF',
    muted: '#7B8DB5',
    dim: '#3D4F7A',
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
