import { getChampionData } from '../../../src/api/getChampionData';
import { ValidationError } from '../../../src/domain/shared/errors/ValidationError';
import type { ChampionStatsDTO } from '../../../src/application/dto/ChampionStatsDTO';

describe('getChampionData', () => {
  describe('validation', () => {
    it('should throw ValidationError for empty champion name', async () => {
      await expect(getChampionData('', 'top', 'd+')).rejects.toThrow(ValidationError);
      await expect(getChampionData('', 'top', 'd+')).rejects.toThrow('championName');
    });

    it('should throw ValidationError for whitespace-only champion name', async () => {
      await expect(getChampionData('   ', 'mid')).rejects.toThrow(ValidationError);
    });
  });

  describe('data structure', () => {
    it('should return ChampionStatsDTO with all required fields', async () => {
      const result: ChampionStatsDTO = await getChampionData('jax', 'top', 'd+');

      expect(result).toHaveProperty('championName');
      expect(result).toHaveProperty('winrate');
      expect(result).toHaveProperty('pickrate');
      expect(result).toHaveProperty('banrate');
      expect(result).toHaveProperty('tier');
      expect(result).toHaveProperty('rank');
      expect(result).toHaveProperty('gamesPlayed');

      expect(typeof result.championName).toBe('string');
      expect(typeof result.winrate).toBe('number');
      expect(typeof result.pickrate).toBe('number');
      expect(typeof result.banrate).toBe('number');
      expect(typeof result.tier).toBe('string');
      expect(typeof result.rank).toBe('number');
      expect(typeof result.gamesPlayed).toBe('number');
    });

    it('should accept various rank shortcuts', async () => {
      const rankShortcuts = ['gm+', 'dia', 'd+', 'p', 'emerald'];

      for (const rank of rankShortcuts) {
        const result = await getChampionData('ahri', 'mid', rank);
        expect(result).toBeDefined();
        expect(result.championName).toBe('ahri');
      }
    });

    it('should accept various lane shortcuts', async () => {
      const laneShortcuts = ['top', 'jg', 'mid', 'bot', 'sup'];

      for (const lane of laneShortcuts) {
        const result = await getChampionData('yasuo', lane);
        expect(result).toBeDefined();
        expect(result.championName).toBe('yasuo');
      }
    });
  });

  describe('default parameters', () => {
    it('should work with default rank and lane parameters', async () => {
      const result = await getChampionData('ahri');

      expect(result).toBeDefined();
      expect(result.championName).toBe('ahri');
    });
  });
});
