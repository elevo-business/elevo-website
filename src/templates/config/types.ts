export interface ColorScheme {
  accent: string;
  accentHover: string;
  bg: string;
  bgEl: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  dim: string;
}

export interface SectionConfig {
  type: 'hero' | 'services' | 'gallery' | 'stats' | 'testimonials' | 'cta';
  enabled: boolean;
  props?: Record<string, unknown>;
}

export interface BranchProfile {
  id: string;
  name: string;
  colorScheme: ColorScheme;
  typography: { heading: string; body: string; };
  sections: SectionConfig[];
  imagery: { style: string; guidelines: string; };
  tonality: string;
}

export interface ProspectData {
  name: string;
  tagline?: string;
  location: string;
  logo?: string;
  phone?: string;
  email?: string;
  website?: string;
  heroTitle: string;
  heroSubtitle: string;
  services: Array<{ icon: string; title: string; description: string; }>;
  stats?: Array<{ value: string; label: string; }>;
  galleryImages?: Array<{ src: string; alt: string; }>;
  testimonials?: Array<{ text: string; author: string; role: string; }>;
}
