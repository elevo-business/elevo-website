import type { BranchProfile } from './types';

export const zahnarztProfile: BranchProfile = {
  id: 'zahnarzt',
  name: 'Zahnarztpraxis',
  colorScheme: {
    accent: '#0E8A7B',
    accentHover: '#0A7A6B',
    bg: '#F7FAFA',
    bgEl: '#EFF7F6',
    surface: '#E5F0EF',
    border: '#C8DDD9',
    text: '#1A2E2A',
    muted: '#5A7A75',
    dim: '#8AABA5',
  },
  typography: {
    heading: 'Sora',
    body: 'Outfit',
  },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'grid' } },
    { type: 'stats', enabled: true },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: {
    style: 'medical',
    guidelines: 'Helle, moderne Praxisräume, freundliches Lächeln, professionelle Zahnbehandlung, warme Atmosphäre',
  },
  tonality: 'Vertrauensvoll, modern, patientenorientiert. Kompetenz und Wohlfühlatmosphäre betonen.',
};
