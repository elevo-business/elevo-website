import type { BranchProfile } from './types';

export const kuechenProfile: BranchProfile = {
  id: 'kuechen',
  name: 'Küchenstudio & Küchenhandel',
  colorScheme: {
    accent: '#D97706',
    accentHover: '#B45309',
    bg: '#0E0903',
    bgEl: '#140D04',
    surface: '#161008',
    border: '#2A1E0A',
    text: '#F5EED8',
    muted: '#A08C60',
    dim: '#6B5A3A',
  },
  typography: {
    heading: 'Sora',
    body: 'Outfit',
  },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'showroom' } },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: {
    style: 'lifestyle',
    guidelines: 'Warme Amber-Töne, Lifestyle-Fotografie, Showroom-Feeling, hochwertige Küchen im Wohnkontext',
  },
  tonality: 'Warm, inspirierend, kompetent. Traumküchen mit persönlicher Beratung — Qualität die man spürt.',
};
