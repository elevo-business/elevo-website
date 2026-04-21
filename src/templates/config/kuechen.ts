import type { BranchProfile } from './types';

export const kuechenProfile: BranchProfile = {
  id: 'kuechen',
  name: 'Küchenstudio & Küchenhandel',
  colorScheme: {
    accent: '#B8860B',
    accentHover: '#996F0A',
    bg: '#FBF8F3',
    bgEl: '#F5EFE3',
    surface: '#EDE5D5',
    border: '#D9CCB5',
    text: '#2A2118',
    muted: '#7A6A50',
    dim: '#A89880',
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
