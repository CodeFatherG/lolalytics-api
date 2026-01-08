import { getCounters } from '../../../src/api/getCounters';
import { ValidationError } from '../../../src/domain/shared/errors/ValidationError';
import type { CounterDTO } from '../../../src/api/getCounters';

describe('getCounters', () => {
  describe('validation', () => {
    it('should throw ValidationError for empty champion name', async () => {
      await expect(getCounters(5, '')).rejects.toThrow(ValidationError);
      await expect(getCounters(5, '')).rejects.toThrow('championName');
    });

    it('should throw ValidationError for whitespace-only champion name', async () => {
      await expect(getCounters(3, '   ')).rejects.toThrow(ValidationError);
    });
  });

  describe('data structure', () => {
    it('should return array of CounterDTO objects', async () => {
      const result: CounterDTO[] = await getCounters(1, 'yasuo');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const counter = result[0];
      expect(counter).toHaveProperty('championName');
      expect(counter).toHaveProperty('winrate');

      expect(typeof counter.championName).toBe('string');
      expect(typeof counter.winrate).toBe('number');
    });

    it('should return up to n counters', async () => {
      const n = 3;
      const result = await getCounters(n, 'yasuo', 'platinum');

      expect(result.length).toBeLessThanOrEqual(n);
    });
  });

  describe('rank shortcuts', () => {
    it('should accept various rank shortcuts', async () => {
      const ranks = ['p', 'dia', 'd+', 'emerald'];

      for (const rank of ranks) {
        const result = await getCounters(1, 'zed', rank);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      }
    });
  });
});
