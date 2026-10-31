import es from '../../../public/i18n/es.json';
import en from '../../../public/i18n/en.json';
import { CLIENTS, PROCESS, PRODUCTS, SERVICE_DETAILS, SERVICES, STATS } from './site.data';

/** Resolves an `application.x.y` key in a translation file (undefined when missing). */
const lookup = (lang: object, key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), lang);

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('site.data', () => {
  it('has unique ids in every list', () => {
    expect(unique(SERVICES.map((s) => s.id))).toBeTrue();
    expect(unique(PRODUCTS.map((s) => s.id))).toBeTrue();
    expect(unique(CLIENTS.map((s) => s.id))).toBeTrue();
    expect(unique(STATS.map((s) => s.id))).toBeTrue();
    expect(unique(PROCESS.map((s) => s.id))).toBeTrue();
  });

  it('routes every product under /productos/', () => {
    expect(PRODUCTS.every((p) => p.route.startsWith('/productos/'))).toBeTrue();
  });

  it('marks all stats as examples', () => {
    expect(STATS.every((s) => s.example === true)).toBeTrue();
  });

  it('does not use the retired figures 150 or 320', () => {
    for (const s of STATS) {
      expect(s.labelKey).not.toContain('150');
      expect(s.labelKey).not.toContain('320');
      expect(String(s.value)).not.toContain('150');
      expect(String(s.value)).not.toContain('320');
    }
  });

  it('lists only khipu as a product', () => {
    expect(PRODUCTS.map((p) => p.id)).toEqual(['khipu']);
    expect(PRODUCTS[0].route).toBe('/productos/khipu');
  });

  it('shows no client logos until real ones are confirmed', () => {
    expect(CLIENTS).toEqual([]);
  });

  it('describes the work process in four steps, in order', () => {
    expect(PROCESS.map((s) => s.id)).toEqual(['understand', 'design', 'build', 'maintain']);
  });

  it('offers the five services, Home and /servicios in the same order with the same anchors', () => {
    expect(SERVICES.map(s => s.id)).toEqual(['web', 'consulting', 'transformation', 'optimization', 'cloud']);
    expect(SERVICE_DETAILS.map(s => s.id)).toEqual(SERVICES.map(s => s.id));
    expect(SERVICE_DETAILS.map(s => s.anchor)).toEqual(SERVICES.map(s => s.anchor));
    expect(SERVICES.map(s => s.anchor)).toEqual(['desarrollo', 'consultoria', 'transformacion', 'optimizacion', 'nube']);
  });

  it('points every service key at real copy in Spanish and English', () => {
    const keys = [
      ...SERVICES.flatMap(s => [s.titleKey, s.descriptionKey, ...(s.tagKeys ?? [])]),
      ...SERVICE_DETAILS.flatMap(s => [s.titleKey, s.summaryKey, ...s.fitKeys, ...s.deliverableKeys]),
    ];
    for (const key of keys) {
      expect(typeof lookup(es, key)).withContext(`es ${key}`).toBe('string');
      expect(typeof lookup(en, key)).withContext(`en ${key}`).toBe('string');
    }
  });
});
