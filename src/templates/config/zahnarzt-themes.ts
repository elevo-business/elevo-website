import type { BranchProfile } from './types';

// Ästhetik & Implantologie — Elegantes Gold/Dunkelblau für Premium-Praxen
export const zahnarztAesthetikProfile: BranchProfile = {
  id: 'zahnarzt-aesthetik',
  name: 'Zahnarzt — Ästhetik & Implantologie',
  colorScheme: {
    accent: '#C9A84C',
    accentHover: '#B8973E',
    bg: '#F8F6F1',
    bgEl: '#F0EDE5',
    surface: '#E8E3D8',
    border: '#D4CCBB',
    text: '#1E2A3A',
    muted: '#5A6677',
    dim: '#8A95A5',
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
    style: 'premium-aesthetic',
    guidelines: 'Elegante Praxisräume, Premium-Behandlungsstühle, strahlende Lächeln. Gold-Akzente und dunkle, luxuriöse Atmosphäre. Professionell und exklusiv.',
  },
  tonality: 'Exklusiv, präzise, vertrauensbildend. Premium-Zahnmedizin mit höchsten Ansprüchen — Perfektion als Versprechen.',
};

// Familienfreundlich — Warmes Grün für Familien- und Kinderpraxen
export const zahnarztFamilieProfile: BranchProfile = {
  id: 'zahnarzt-familie',
  name: 'Zahnarzt — Familienpraxis',
  colorScheme: {
    accent: '#2D9E6F',
    accentHover: '#258A5F',
    bg: '#F7FBF8',
    bgEl: '#EFF6F1',
    surface: '#E2EFE7',
    border: '#C5DBC9',
    text: '#1A2E22',
    muted: '#5A7A65',
    dim: '#8AAF95',
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
    style: 'family-friendly',
    guidelines: 'Helle, einladende Praxisräume mit warmer Atmosphäre. Familien mit Kindern, lächelnde Patienten aller Altersgruppen. Freundlich und nahbar.',
  },
  tonality: 'Herzlich, familiär, generationenübergreifend. Zahngesundheit für die ganze Familie — von Klein bis Groß in guten Händen.',
};

// Angstpatienten — Beruhigendes Hellblau für sanfte, patientenorientierte Praxen
export const zahnarztAngstProfile: BranchProfile = {
  id: 'zahnarzt-angst',
  name: 'Zahnarzt — Angstpatienten & Schmerzfrei',
  colorScheme: {
    accent: '#7CB9E8',
    accentHover: '#6AADDF',
    bg: '#F5FAFE',
    bgEl: '#EBF4FB',
    surface: '#DCE9F4',
    border: '#B8D4E8',
    text: '#1A2A3A',
    muted: '#5A7A8F',
    dim: '#8AAFC2',
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
    style: 'calm-soothing',
    guidelines: 'Ruhige, helle Räume mit beruhigender Atmosphäre. Entspannte Patienten, einfühlsame Behandlungen. Sanfte Beleuchtung, keine klinische Kälte.',
  },
  tonality: 'Einfühlsam, verständnisvoll, sanft. Zahnarztangst überwinden — mit Geduld, modernster Betäubung und echtem Verständnis.',
};

// Modern & Digital — Kühles Blau für technologieorientierte Praxen
export const zahnarztModernProfile: BranchProfile = {
  id: 'zahnarzt-modern',
  name: 'Zahnarzt — Modern & Digital',
  colorScheme: {
    accent: '#3B82F6',
    accentHover: '#2563EB',
    bg: '#F8FAFC',
    bgEl: '#F1F5F9',
    surface: '#E2E8F0',
    border: '#CBD5E1',
    text: '#0F172A',
    muted: '#475569',
    dim: '#94A3B8',
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
    style: 'modern-digital',
    guidelines: 'Hochmoderne Praxisausstattung, digitale Technik, präzise Instrumente. Klare, sachliche Ästhetik mit technischem Vertrauen.',
  },
  tonality: 'Kompetent, innovativ, präzise. Modernste Zahnmedizin mit digitaler Präzision — Technologie im Dienst Ihres Lächelns.',
};
