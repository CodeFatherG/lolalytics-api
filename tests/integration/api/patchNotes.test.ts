import { patchNotes } from '../../../src/api/patchNotes';
import { ValidationError } from '../../../src/domain/shared/errors/ValidationError';
import type { PatchNotesDTO } from '../../../src/application/dto/PatchNotesDTO';

describe('patchNotes', () => {
  describe('validation', () => {
    it('should throw ValidationError for invalid category', async () => {
      await expect(patchNotes('invalid')).rejects.toThrow(ValidationError);
    });
  });

  describe('category filtering', () => {
    it('should return all categories when category is "all"', async () => {
      const result: PatchNotesDTO = await patchNotes('all', 'g+');

      expect(result).toHaveProperty('buffed');
      expect(result).toHaveProperty('nerfed');
      expect(result).toHaveProperty('adjusted');

      expect(Array.isArray(result.buffed)).toBe(true);
      expect(Array.isArray(result.nerfed)).toBe(true);
      expect(Array.isArray(result.adjusted)).toBe(true);
    });

    it('should return only buffed champions when category is "buffed"', async () => {
      const result: PatchNotesDTO = await patchNotes('buffed');

      expect(result).toHaveProperty('buffed');
      expect(result).not.toHaveProperty('nerfed');
      expect(result).not.toHaveProperty('adjusted');

      expect(Array.isArray(result.buffed)).toBe(true);
    });

    it('should return only nerfed champions when category is "nerfed"', async () => {
      const result: PatchNotesDTO = await patchNotes('nerfed');

      expect(result).toHaveProperty('nerfed');
      expect(result).not.toHaveProperty('buffed');
      expect(result).not.toHaveProperty('adjusted');

      expect(Array.isArray(result.nerfed)).toBe(true);
    });

    it('should return only adjusted champions when category is "adjusted"', async () => {
      const result: PatchNotesDTO = await patchNotes('adjusted');

      expect(result).toHaveProperty('adjusted');
      expect(result).not.toHaveProperty('buffed');
      expect(result).not.toHaveProperty('nerfed');

      expect(Array.isArray(result.adjusted)).toBe(true);
    });
  });

  describe('data structure', () => {
    it('should return PatchNotesDTO with correct structure for each category', async () => {
      const result = await patchNotes('all', 'emerald');

      // Check buffed structure if it has entries
      if (result.buffed && result.buffed.length > 0) {
        const buffedChamp = result.buffed[0];
        expect(buffedChamp).toHaveProperty('championName');
        expect(buffedChamp).toHaveProperty('winrateDelta');
        expect(buffedChamp).toHaveProperty('pickrateDelta');
        expect(buffedChamp).toHaveProperty('banrateDelta');

        expect(typeof buffedChamp.championName).toBe('string');
        expect(typeof buffedChamp.winrateDelta).toBe('string');
        expect(typeof buffedChamp.pickrateDelta).toBe('string');
        expect(typeof buffedChamp.banrateDelta).toBe('string');
      }
    });
  });

  describe('rank shortcuts', () => {
    it('should accept various rank shortcuts', async () => {
      const ranks = ['p', 'dia', 'emerald'];

      for (const rank of ranks) {
        const result = await patchNotes('buffed', rank);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('buffed');
      }
    });
  });
});
