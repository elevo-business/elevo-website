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

// ─── Individuelle Praxis-Profile ────────────────────────────────────────────
// Jedes Profil ist auf die jeweilige Praxis zugeschnitten: eigene Farbe,
// eigene Positionierung. Wird in den Preview-Pages direkt verwendet.

// Dr. Klein — Premium Implantologie & Ästhetik, München-Schwabing
// Tiefes Teal-Gold für exklusive, medizinische Hochwertigkeit
export const drKleinZahnarztProfile: BranchProfile = {
  id: 'dr-klein-zahnarzt',
  name: 'Dr. Klein — Premium Implantologie München',
  colorScheme: {
    accent: '#0E8A7B',
    accentHover: '#0C7A6D',
    bg: '#0d1f1c',
    bgEl: '#112520',
    surface: '#163028',
    border: 'rgba(14,138,123,0.2)',
    text: '#E8F5F3',
    muted: '#8aafa5',
    dim: '#5a8a82',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'premium-aesthetic', guidelines: 'Dunkle, luxuriöse Atmosphäre. Moderne Implantologie, elegante Teal-Akzente.' },
  tonality: 'Exklusiv, präzise, vertrauensbildend. Premium-Zahnmedizin mit höchsten Ansprüchen.',
};

// Zahnarztpraxis Fischer — Angstpatienten & Schmerzfrei, Frankfurt am Main
// Sanftes Stahlblau: beruhigend, vertrauensvoll, nicht klinisch
export const zahnarztFischerProfile: BranchProfile = {
  id: 'zahnarzt-fischer',
  name: 'Zahnarztpraxis Fischer — Frankfurt',
  colorScheme: {
    accent: '#2B7FBF',
    accentHover: '#2268A0',
    bg: '#F4F8FC',
    bgEl: '#EAF2F8',
    surface: '#D8E8F4',
    border: '#B0CDE0',
    text: '#152336',
    muted: '#4A6A80',
    dim: '#7A9DB5',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'calm-soothing', guidelines: 'Helle, ruhige Räume. Entspannte Patienten, einfühlsame Atmosphäre.' },
  tonality: 'Einfühlsam, geduldig, schmerzfrei. Angstfreie Zahnbehandlung als Versprechen.',
};

// Zahnarztpraxis Hartmann — Modern & Digital, Berlin-Mitte
// Dunkel-Navy mit leuchtendem Cyan: technologisch, präzise, zeitgemäß
export const zahnarztHartmannProfile: BranchProfile = {
  id: 'zahnarzt-hartmann',
  name: 'Zahnarztpraxis Hartmann — Berlin',
  colorScheme: {
    accent: '#00B4D8',
    accentHover: '#009BBD',
    bg: '#060E1A',
    bgEl: '#0A1628',
    surface: '#112040',
    border: 'rgba(0,180,216,0.18)',
    text: '#E0F4FA',
    muted: '#6A9AB0',
    dim: '#3A6A80',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'modern-digital', guidelines: 'Hightech-Ausstattung, digitale Präzision. Klare, sachliche Ästhetik.' },
  tonality: 'Kompetent, innovativ, präzise. Digitale Zahnmedizin auf höchstem Niveau.',
};

// Zahnarztpraxis Wagner — Modern & Digital, Hamburg-Eppendorf
// Tiefes Navy mit warmem Mintgrün: hanseatisch, professionell, einladend
export const zahnarztWagnerProfile: BranchProfile = {
  id: 'zahnarzt-wagner',
  name: 'Zahnarztpraxis Wagner — Hamburg',
  colorScheme: {
    accent: '#3CBFAE',
    accentHover: '#2FAD9C',
    bg: '#F2FAFA',
    bgEl: '#E6F5F4',
    surface: '#D0EDEA',
    border: '#A8D8D4',
    text: '#0F2826',
    muted: '#3A6A65',
    dim: '#6A9A96',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'modern-digital', guidelines: 'Helle, nordisch-moderne Praxisräume. Digitale Technik, offene Atmosphäre.' },
  tonality: 'Kompetent, offen, hanseatisch. Moderne Zahnmedizin mit persönlichem Anspruch.',
};

// Zahnarztpraxis Weber — Familienpraxis, Stuttgart-Mitte
// Warmes Waldgrün: nahbar, vertrauensvoll, für alle Generationen
export const zahnarztWeberProfile: BranchProfile = {
  id: 'zahnarzt-weber',
  name: 'Zahnarztpraxis Weber — Stuttgart',
  colorScheme: {
    accent: '#2E8B57',
    accentHover: '#247A4B',
    bg: '#F5FAF7',
    bgEl: '#EBF5EF',
    surface: '#D8ECDE',
    border: '#B4D8BE',
    text: '#152A1E',
    muted: '#426A50',
    dim: '#72A082',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'family-friendly', guidelines: 'Warme, einladende Atmosphäre. Familien aller Altersgruppen, herzliches Team.' },
  tonality: 'Herzlich, vertrauensvoll, generationenübergreifend. Ihre Familienpraxis im Herzen Stuttgarts.',
};

// Zahnarztpraxis Bergmann — Familienpraxis, Hamburg-Altona
// Ozeanisches Blaugrün: frisch, offen, norddeutsch
export const praxisBergmannProfile: BranchProfile = {
  id: 'praxis-bergmann',
  name: 'Zahnarztpraxis Bergmann — Hamburg-Altona',
  colorScheme: {
    accent: '#0D7377',
    accentHover: '#0A6165',
    bg: '#F2FAFA',
    bgEl: '#E4F4F4',
    surface: '#CCE8E8',
    border: '#A0D0D0',
    text: '#0A2424',
    muted: '#3A6868',
    dim: '#6A9898',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'family-friendly', guidelines: 'Helle, norddeutsche Atmosphäre. Freundliches Team, moderne Ausstattung.' },
  tonality: 'Herzlich, familiär, zuverlässig. Zahngesundheit für Hamburg-Altona und die ganze Familie.',
};

// Zahnarztpraxis Hoffmann & Kollegen — Ästhetik, Stuttgart
// Elegantes Pflaume/Violett: anspruchsvoll, weiblich, premium
export const praxisHoffmannProfile: BranchProfile = {
  id: 'praxis-hoffmann',
  name: 'Zahnarztpraxis Hoffmann & Kollegen — Stuttgart',
  colorScheme: {
    accent: '#6B3FA0',
    accentHover: '#5A3388',
    bg: '#FAF8FC',
    bgEl: '#F2EEF8',
    surface: '#E8E0F4',
    border: '#C8B8E4',
    text: '#1E1030',
    muted: '#5A4870',
    dim: '#8A78A0',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'premium-aesthetic', guidelines: 'Elegante Praxisräume, Premium-Behandlungen, ästhetische Perfektion.' },
  tonality: 'Elegant, vertrauensvoll, anspruchsvoll. Ästhetische Zahnmedizin auf höchstem Niveau.',
};

// Praxis Lehmann — Implantologie & Prothetik, Düsseldorf-Stadtmitte
// Indigo-Tiefe: solide Expertise, medizinische Kompetenz, Vertrauen
export const praxisLehmannProfile: BranchProfile = {
  id: 'praxis-lehmann',
  name: 'Praxis Lehmann — Implantologie & Prothetik Düsseldorf',
  colorScheme: {
    accent: '#3452A4',
    accentHover: '#2A4490',
    bg: '#F6F8FC',
    bgEl: '#ECF0F8',
    surface: '#D8E0F0',
    border: '#B0C0E0',
    text: '#0E1830',
    muted: '#3A4E70',
    dim: '#6A7EA0',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'modern-digital', guidelines: 'Moderne Implantologie, hochwertige Prothetik, klare Professionalität.' },
  tonality: 'Kompetent, erfahren, verlässlich. Implantologie und Prothetik als Lebenswerk.',
};

// Zahnarztpraxis Dr. Schäfer — Familienpraxis, Düsseldorf
// Olivgrün-Erde: warm, natürlich, nachhaltig denkend
export const praxisSchaeferProfile: BranchProfile = {
  id: 'praxis-schaefer',
  name: 'Zahnarztpraxis Dr. Schäfer — Düsseldorf',
  colorScheme: {
    accent: '#4A7C59',
    accentHover: '#3D6A4A',
    bg: '#F6FAF7',
    bgEl: '#EBF3EE',
    surface: '#D8EAE0',
    border: '#B2D0BA',
    text: '#162418',
    muted: '#3E5E44',
    dim: '#6E8E74',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'family-friendly', guidelines: 'Natürliche, warme Atmosphäre. Familiäre Praxis, alle Generationen willkommen.' },
  tonality: 'Herzlich, nahbar, kompetent. Zahngesundheit mit Weitblick für Ihre ganze Familie.',
};

// Praxis Schneider — Ästhetische Zahnmedizin, Köln-Innenstadt
// Tiefes Karminrot: leidenschaftlich, auffallend, premium
export const praxisSchneiderProfile: BranchProfile = {
  id: 'praxis-schneider',
  name: 'Praxis Schneider — Ästhetische Zahnmedizin Köln',
  colorScheme: {
    accent: '#B8364A',
    accentHover: '#A02A3E',
    bg: '#FDF7F8',
    bgEl: '#F8EEF0',
    surface: '#F0DCE0',
    border: '#DDB8BE',
    text: '#280E12',
    muted: '#703848',
    dim: '#A06878',
  },
  typography: { heading: 'Sora', body: 'Outfit' },
  sections: [
    { type: 'hero', enabled: true },
    { type: 'services', enabled: true },
    { type: 'stats', enabled: true },
    { type: 'gallery', enabled: true, props: { style: 'treatment-showcase' } },
    { type: 'testimonials', enabled: true },
    { type: 'cta', enabled: true },
  ],
  imagery: { style: 'premium-aesthetic', guidelines: 'Dramatische, elegante Ästhetik. Premium-Behandlungen, strahlende Transformationen.' },
  tonality: 'Leidenschaftlich, ästhetisch, mutig. Ihr Lächeln als Kunstwerk — Köln im Herzen.',
};
