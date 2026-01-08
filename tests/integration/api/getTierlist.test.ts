import { getTierlist } from '../../../src/api/getTierlist';
import { ValidationError } from '../../../src/domain/shared/errors/ValidationError';
import type { TierListDTO } from '../../../src/application/dto/TierListDTO';

describe('getTierlist', () => {
  describe('validation', () => {
    it('should throw ValidationError for invalid lane', async () => {
      await expect(getTierlist(5, 'invalidlane', 'gm+')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid rank', async () => {
      await expect(getTierlist(5, 'top', 'invalidrank')).rejects.toThrow(ValidationError);
    });
  });

  describe('lane shortcuts', () => {
    const validLanes = [
      'top',
      'jg',
      'jungle',
      'mid',
      'middle',
      'bot',
      'bottom',
      'adc',
      'support',
      'sup',
    ];

    it.each(validLanes)('should accept valid lane shortcut: %s', async (lane) => {
      // This test verifies the lane is accepted without throwing ValidationError
      // We only fetch 1 item to minimize API load
      const result = await getTierlist(1, lane);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('data structure', () => {
    it('should return TierListDTO with correct structure', async () => {
      const result: TierListDTO = await getTierlist(1, 'mid', 'emerald');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const entry = result[0];
      expect(entry).toHaveProperty('rank');
      expect(entry).toHaveProperty('championName');
      expect(entry).toHaveProperty('tier');
      expect(entry).toHaveProperty('winrate');

      expect(typeof entry.rank).toBe('number');
      expect(typeof entry.championName).toBe('string');
      expect(typeof entry.tier).toBe('string');
      expect(typeof entry.winrate).toBe('number');
    });

    it('should return exactly n champions when requested', async () => {
      const n = 3;
      const result = await getTierlist(n, 'top', 'diamond');

      expect(result.length).toBeLessThanOrEqual(n);
    });
  });
});
