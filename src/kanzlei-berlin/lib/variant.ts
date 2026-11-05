// Headline-Test A/B/C (Briefing, Abschnitt 9): ?h=a|b|c > gemerkter Wert > defaultVariant
import { read, write } from '../../neukundensystem/lib/storage';

export const VARIANT_KEY = 'lp_headline';
export const VARIANTS = ['a', 'b', 'c'] as const;
export type Variant = (typeof VARIANTS)[number];

const isVariant = (value: string | null | undefined): value is Variant => VARIANTS.includes(value as Variant);

export function resolveVariant(fallback: string): Variant {
  const param = new URLSearchParams(window.location.search).get('h')?.toLowerCase();
  if (isVariant(param)) {
    write('session', VARIANT_KEY, param);
    return param;
  }
  const stored = read('session', VARIANT_KEY);
  if (isVariant(stored)) return stored;
  return isVariant(fallback) ? fallback : 'a';
}
