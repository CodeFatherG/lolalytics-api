import { TierRating } from '../../../../src/domain/champion-statistics/value-objects/TierRating';

describe('TierRating Value Object', () => {
  describe('validation', () => {
    it('should accept valid tier values', () => {
      const validTiers = ['S+', 'S', 'A', 'B', 'C', 'D', 'F'];

      validTiers.forEach(tier => {
        expect(() => TierRating.from(tier)).not.toThrow();
      });
    });

    it('should accept lowercase tier values', () => {
      expect(() => TierRating.from('s+')).not.toThrow();
      expect(() => TierRating.from('a')).not.toThrow();
      expect(() => TierRating.from('f')).not.toThrow();
    });

    it('should reject invalid tier values', () => {
      expect(() => TierRating.from('SS')).toThrow();
      expect(() => TierRating.from('E')).toThrow();
      expect(() => TierRating.from('Z')).toThrow();
      expect(() => TierRating.from('1')).toThrow();
      expect(() => TierRating.from('')).toThrow();
    });

    it('should provide helpful error message for invalid tiers', () => {
      try {
        TierRating.from('invalid');
        fail('Should have thrown error');
      } catch (error) {
        const message = (error as Error).message;
        expect(message).toContain('invalid');
        expect(message).toContain('S+');
      }
    });
  });

  describe('toNumericScore', () => {
    it('should return correct numeric scores', () => {
      expect(TierRating.from('S+').toNumericScore()).toBe(7);
      expect(TierRating.from('S').toNumericScore()).toBe(6);
      expect(TierRating.from('A').toNumericScore()).toBe(5);
      expect(TierRating.from('B').toNumericScore()).toBe(4);
      expect(TierRating.from('C').toNumericScore()).toBe(3);
      expect(TierRating.from('D').toNumericScore()).toBe(2);
      expect(TierRating.from('F').toNumericScore()).toBe(1);
    });
  });

  describe('comparison', () => {
    it('should compare tiers correctly', () => {
      const sPlus = TierRating.from('S+');
      const s = TierRating.from('S');
      const a = TierRating.from('A');
      const f = TierRating.from('F');

      expect(sPlus.compareTo(s)).toBeGreaterThan(0); // S+ > S
      expect(s.compareTo(a)).toBeGreaterThan(0); // S > A
      expect(a.compareTo(f)).toBeGreaterThan(0); // A > F
      expect(f.compareTo(a)).toBeLessThan(0); // F < A
      expect(s.compareTo(s)).toBe(0); // S == S
    });
  });

  describe('toString', () => {
    it('should return tier as string', () => {
      expect(TierRating.from('S+').toString()).toBe('S+');
      expect(TierRating.from('a').toString()).toBe('A');
      expect(TierRating.from('f').toString()).toBe('F');
    });
  });

  describe('immutability', () => {
    it('should be immutable', () => {
      const tier = TierRating.from('S+');
      const str = tier.toString();

      // Tier should remain unchanged
      expect(tier.toString()).toBe(str);
      expect(tier.toNumericScore()).toBe(7);
    });
  });
});
