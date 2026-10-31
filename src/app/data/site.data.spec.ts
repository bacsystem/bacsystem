import { CLIENTS, PRODUCTS, SERVICES, STATS } from './site.data';

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('site.data', () => {
  it('has unique ids in every list', () => {
    expect(unique(SERVICES.map((s) => s.id))).toBeTrue();
    expect(unique(PRODUCTS.map((s) => s.id))).toBeTrue();
    expect(unique(CLIENTS.map((s) => s.id))).toBeTrue();
    expect(unique(STATS.map((s) => s.id))).toBeTrue();
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

  it('features OperaAI', () => {
    expect(PRODUCTS.find((p) => p.featured)?.id).toBe('operaai');
  });
});
