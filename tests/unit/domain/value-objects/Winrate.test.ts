import { Winrate } from '../../../../src/domain/champion-statistics/value-objects/Winrate';

describe('Winrate Value Object', () => {
  describe('validation', () => {
    it('should reject values below 0%', () => {
      expect(() => Winrate.fromPercentage(-1)).toThrow();
      expect(() => Winrate.fromPercentage(-50)).toThrow();
    });

    it('should reject values above 100%', () => {
      expect(() => Winrate.fromPercentage(101)).toThrow();
      expect(() => Winrate.fromPercentage(150)).toThrow();
    });

    it('should accept valid percentages between 0-100', () => {
      expect(() => Winrate.fromPercentage(0)).not.toThrow();
      expect(() => Winrate.fromPercentage(50)).not.toThrow();
      expect(() => Winrate.fromPercentage(100)).not.toThrow();
      expect(() => Winrate.fromPercentage(52.5)).not.toThrow();
    });
  });

  describe('fromString parsing', () => {
    it('should parse "52.5%" correctly', () => {
      const winrate = Winrate.fromString('52.5%');
      expect(winrate.toPercentage()).toBe(52.5);
    });

    it('should parse "52.5" without percent sign', () => {
      const winrate = Winrate.fromString('52.5');
      expect(winrate.toPercentage()).toBe(52.5);
    });

    it('should parse strings with whitespace', () => {
      const winrate = Winrate.fromString('  52.5%  ');
      expect(winrate.toPercentage()).toBe(52.5);
    });

    it('should throw for invalid strings', () => {
      expect(() => Winrate.fromString('invalid')).toThrow();
      expect(() => Winrate.fromString('abc%')).toThrow();
      expect(() => Winrate.fromString('')).toThrow();
    });
  });

  describe('immutability', () => {
    it('should be immutable - value cannot be changed after creation', () => {
      const winrate = Winrate.fromPercentage(52.5);
      const value = winrate.toPercentage();

      // Try to modify (this should have no effect due to private readonly)
      // @ts-expect-error - Attempting to modify readonly property
      winrate.value = 100;

      // Value should remain unchanged
      expect(winrate.toPercentage()).toBe(value);
    });
  });

  describe('conversion methods', () => {
    it('should convert to percentage correctly', () => {
      const winrate = Winrate.fromPercentage(52.5);
      expect(winrate.toPercentage()).toBe(52.5);
    });

    it('should convert to decimal correctly', () => {
      const winrate = Winrate.fromPercentage(52.5);
      expect(winrate.toDecimal()).toBe(0.525);
    });

    it('should convert to string with % symbol', () => {
      const winrate = Winrate.fromPercentage(52.5);
      expect(winrate.toString()).toBe('52.5%');
    });
  });
});
