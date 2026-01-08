import { MatchupResult } from '../../../../src/domain/matchup-analysis/entities/MatchupResult';
import { Winrate } from '../../../../src/domain/champion-statistics/value-objects/Winrate';

describe('MatchupResult Aggregate', () => {
  describe('invariant: champion1 != champion2', () => {
    it('should enforce that champion1 and champion2 must be different', () => {
      const winrate = Winrate.fromPercentage(52);

      expect(() =>
        MatchupResult.create('yasuo', 'yasuo', winrate, 1000)
      ).toThrow();

      expect(() =>
        MatchupResult.create('Yasuo', 'yasuo', winrate, 1000)
      ).toThrow(); // Case-insensitive check
    });

    it('should allow different champions', () => {
      const winrate = Winrate.fromPercentage(52);

      expect(() =>
        MatchupResult.create('yasuo', 'zed', winrate, 1000)
      ).not.toThrow();
    });

    it('should provide meaningful error message', () => {
      const winrate = Winrate.fromPercentage(52);

      try {
        MatchupResult.create('yasuo', 'yasuo', winrate, 1000);
        fail('Should have thrown error');
      } catch (error) {
        const message = (error as Error).message;
        expect(message).toContain('same champion');
      }
    });
  });

  describe('invariant: totalGames >= 0', () => {
    it('should enforce non-negative total games', () => {
      const winrate = Winrate.fromPercentage(52);

      expect(() =>
        MatchupResult.create('yasuo', 'zed', winrate, -1)
      ).toThrow();

      expect(() =>
        MatchupResult.create('yasuo', 'zed', winrate, -100)
      ).toThrow();
    });

    it('should allow zero and positive games', () => {
      const winrate = Winrate.fromPercentage(52);

      expect(() =>
        MatchupResult.create('yasuo', 'zed', winrate, 0)
      ).not.toThrow();

      expect(() =>
        MatchupResult.create('yasuo', 'zed', winrate, 1000)
      ).not.toThrow();
    });
  });

  describe('matchup analysis methods', () => {
    it('should correctly determine if matchup favors champion1', () => {
      const favoringWinrate = Winrate.fromPercentage(55);
      const matchup = MatchupResult.create('yasuo', 'zed', favoringWinrate, 1000);

      expect(matchup.favorsChampion1()).toBe(true);
    });

    it('should correctly determine if matchup favors champion2', () => {
      const favoringWinrate = Winrate.fromPercentage(45);
      const matchup = MatchupResult.create('yasuo', 'zed', favoringWinrate, 1000);

      expect(matchup.favorsChampion1()).toBe(false);
    });

    it('should correctly identify balanced matchups', () => {
      const balancedWinrate = Winrate.fromPercentage(50);
      const matchup = MatchupResult.create('yasuo', 'zed', balancedWinrate, 1000);

      expect(matchup.isBalanced()).toBe(true);

      const slightlyFavoringWinrate = Winrate.fromPercentage(51);
      const matchup2 = MatchupResult.create('yasuo', 'zed', slightlyFavoringWinrate, 1000);

      expect(matchup2.isBalanced()).toBe(true);
    });

    it('should calculate advantage correctly', () => {
      const winrate = Winrate.fromPercentage(55);
      const matchup = MatchupResult.create('yasuo', 'zed', winrate, 1000);

      expect(matchup.getAdvantage()).toBe(5); // 55 - 50 = 5

      const disadvantageWinrate = Winrate.fromPercentage(45);
      const matchup2 = MatchupResult.create('yasuo', 'zed', disadvantageWinrate, 1000);

      expect(matchup2.getAdvantage()).toBe(-5); // 45 - 50 = -5
    });
  });

  describe('getters', () => {
    it('should return champion names correctly', () => {
      const winrate = Winrate.fromPercentage(52);
      const matchup = MatchupResult.create('yasuo', 'zed', winrate, 1000);

      expect(matchup.getChampion1()).toBe('yasuo');
      expect(matchup.getChampion2()).toBe('zed');
    });

    it('should normalize champion names to lowercase', () => {
      const winrate = Winrate.fromPercentage(52);
      const matchup = MatchupResult.create('Yasuo', 'Zed', winrate, 1000);

      expect(matchup.getChampion1()).toBe('yasuo');
      expect(matchup.getChampion2()).toBe('zed');
    });
  });
});
