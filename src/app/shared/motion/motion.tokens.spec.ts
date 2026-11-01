import { MAX_CASCADE, STAGGER, cascadeStep } from './motion.tokens';

describe('cascadeStep', () => {
  it('keeps the normal step for short groups', () => {
    expect(cascadeStep(1)).toBe(STAGGER);
    expect(cascadeStep(4)).toBe(STAGGER);
  });

  it('shrinks the step so a long list never cascades past MAX_CASCADE', () => {
    for (const count of [8, 12, 18]) {
      expect(cascadeStep(count) * (count - 1)).withContext(`${count} items`).toBeCloseTo(MAX_CASCADE, 5);
    }
  });

  it('respects a smaller step given by the caller', () => {
    expect(cascadeStep(18, STAGGER / 2)).toBeLessThanOrEqual(STAGGER / 2);
    expect(cascadeStep(3, STAGGER / 2)).toBe(STAGGER / 2);
  });
});
