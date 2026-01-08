import { matchup } from '../../../src/api/matchup';
import { ValidationError } from '../../../src/domain/shared/errors/ValidationError';
import type { MatchupDTO } from '../../../src/application/dto/MatchupDTO';

describe('matchup', () => {
  describe('validation', () => {
    it('should throw ValidationError for empty champion1 name', async () => {
      await expect(matchup('', 'vayne', 'top', 'master')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for empty champion2 name', async () => {
      await expect(matchup('jax', '', 'top', 'master')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when both champions are the same', async () => {
      await expect(matchup('yasuo', 'yasuo', 'mid')).rejects.toThrow(ValidationError);
    });
  });

  describe('data structure', () => {
    it('should return MatchupDTO with correct structure', async () => {
      const result: MatchupDTO = await matchup('jax', 'vayne', 'top', 'master');

      expect(result).toHaveProperty('champion1');
      expect(result).toHaveProperty('champion2');
      expect(result).toHaveProperty('winrate');
      expect(result).toHaveProperty('totalGames');

      expect(typeof result.champion1).toBe('string');
      expect(typeof result.champion2).toBe('string');
      expect(typeof result.winrate).toBe('number');
      expect(typeof result.totalGames).toBe('number');

      expect(result.champion1).toBe('jax');
      expect(result.champion2).toBe('vayne');
    });
  });

  describe('lane and rank shortcuts', () => {
    it('should accept various lane shortcuts', async () => {
      const lanes = ['top', 'mid', 'bot'];

      for (const lane of lanes) {
        const result = await matchup('zed', 'yasuo', lane);
        expect(result).toBeDefined();
      }
    });

    it('should accept various rank shortcuts', async () => {
      const ranks = ['p', 'dia', 'master'];

      for (const rank of ranks) {
        const result = await matchup('ahri', 'syndra', 'mid', rank);
        expect(result).toBeDefined();
      }
    });
  });

  describe('default parameters', () => {
    it('should work with default lane and rank', async () => {
      const result = await matchup('zed', 'yasuo');

      expect(result).toBeDefined();
      expect(result.champion1).toBe('zed');
      expect(result.champion2).toBe('yasuo');
    });
  });
});
