import type { BranchProfile } from './types';

export const zahnarztProfile: BranchProfile = {
  id: 'zahnarzt',
  name: 'Zahnarzt & Dentalpraxis',
  colorScheme: {
    accent: '#0E8A7B',
    accentHover: '#0B7469',
    bg: '#F7FCFB',
    bgEl: '#EFF8F6',
    surface: '#E5F2EF',
    border: '#C8E0DA',
    text: '#1A2E2A',
    muted: '#5A7A72',
    dim: '#8AAFA5',
  },
  typography: {
    heading: 'Sora',
    body: 'Outfit',
  },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: {
    style: 'medical-warm',
    guidelines: 'Helle, freundliche Praxisräume, lächelnde Patienten, moderne Behandlungstechnik, Vertrauen und Wohlfühlatmosphäre. KEINE klinisch-kalten Bilder.',
  },
  tonality: 'Einfühlsam, kompetent, patientennah. Moderne Zahnmedizin in Wohlfühlatmosphäre — Vertrauen durch Transparenz.',
};
