import { getTierlist } from '../../../src/api/getTierlist';
import { getChampionData } from '../../../src/api/getChampionData';
import { getCounters } from '../../../src/api/getCounters';
import { matchup } from '../../../src/api/matchup';
import { patchNotes } from '../../../src/api/patchNotes';
import { ValidationError } from '../../../src/domain/shared/errors/ValidationError';

describe('Input Validation', () => {
  describe('Lane Validation', () => {
    it('should throw ValidationError for invalid lane in getTierlist', async () => {
      const invalidLanes = ['invalid', 'xyz', '123', 'toplaner'];

      for (const lane of invalidLanes) {
        await expect(getTierlist(1, lane)).rejects.toThrow(ValidationError);
      }
    });

    it('should provide helpful error message for invalid lane', async () => {
      try {
        await getTierlist(1, 'invalidlane');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('lane');
      }
    });
  });

  describe('Rank Validation', () => {
    it('should throw ValidationError for invalid rank shortcuts', async () => {
      const invalidRanks = ['invalid', 'xyz', '999', 'challanger'];

      for (const rank of invalidRanks) {
        await expect(getTierlist(1, 'top', rank)).rejects.toThrow(ValidationError);
      }
    });

    it('should provide helpful error message for invalid rank', async () => {
      try {
        await getTierlist(1, 'top', 'invalidrank');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toContain('rank');
      }
    });
  });

  describe('Champion Name Validation', () => {
    it('should throw ValidationError for empty champion name in getChampionData', async () => {
      await expect(getChampionData('')).rejects.toThrow(ValidationError);
      await expect(getChampionData('   ')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for empty champion name in getCounters', async () => {
      await expect(getCounters(5, '')).rejects.toThrow(ValidationError);
      await expect(getCounters(5, '   ')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for empty champion names in matchup', async () => {
      await expect(matchup('', 'yasuo')).rejects.toThrow(ValidationError);
      await expect(matchup('zed', '')).rejects.toThrow(ValidationError);
      await expect(matchup('', '')).rejects.toThrow(ValidationError);
    });

    it('should provide parameter context in ValidationError', async () => {
      try {
        await getChampionData('');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        const validationError = error as ValidationError;
        expect(validationError.parameterName).toBe('championName');
        expect(validationError.invalidValue).toBe('');
      }
    });
  });

  describe('Category Validation', () => {
    it('should throw ValidationError for invalid patch notes category', async () => {
      const invalidCategories = ['invalid', 'boosted', 'changed', '123'];

      for (const category of invalidCategories) {
        await expect(patchNotes(category)).rejects.toThrow(ValidationError);
      }
    });

    it('should accept valid categories', async () => {
      const validCategories = ['all', 'buffed', 'nerfed', 'adjusted'];

      for (const category of validCategories) {
        const result = await patchNotes(category);
        expect(result).toBeDefined();
      }
    });
  });

  describe('Validation Before Network Request', () => {
    it('should validate empty champion name BEFORE making network request', async () => {
      const startTime = Date.now();

      try {
        await getChampionData('');
        fail('Should have thrown ValidationError');
      } catch (error) {
        const elapsed = Date.now() - startTime;
        // Validation should be instant (< 100ms), not wait for network
        expect(elapsed).toBeLessThan(100);
        expect(error).toBeInstanceOf(ValidationError);
      }
    });

    it('should validate invalid lane BEFORE making network request', async () => {
      const startTime = Date.now();

      try {
        await getTierlist(1, 'invalidlane');
        fail('Should have thrown ValidationError');
      } catch (error) {
        const elapsed = Date.now() - startTime;
        // Validation should be instant (< 100ms), not wait for network
        expect(elapsed).toBeLessThan(100);
        expect(error).toBeInstanceOf(ValidationError);
      }
    });
  });
});
