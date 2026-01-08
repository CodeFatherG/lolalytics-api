import { displayRanks, displayLanes } from '../../../src/api/index';
import type { RankMappings } from '../../../src/api/displayRanks';
import type { LaneMappings } from '../../../src/api/displayLanes';

describe('displayRanks', () => {
  it('should return complete rank mappings object', () => {
    const mappings: RankMappings = displayRanks();

    expect(mappings).toBeDefined();
    expect(typeof mappings).toBe('object');
    expect(Object.keys(mappings).length).toBeGreaterThan(0);
  });

  it('should include common rank shortcuts', () => {
    const mappings = displayRanks();

    // Test some common shortcuts
    expect(mappings).toHaveProperty('gm+');
    expect(mappings).toHaveProperty('dia');
    expect(mappings).toHaveProperty('p');
    expect(mappings).toHaveProperty('emerald');
  });

  it('should map shortcuts to canonical values correctly', () => {
    const mappings = displayRanks();

    expect(mappings['gm+']).toBe('grandmaster_plus');
    expect(mappings['dia']).toBe('diamond');
    expect(mappings['p']).toBe('platinum');
  });

  it('should handle empty string for default rank', () => {
    const mappings = displayRanks();

    expect(mappings['']).toBeDefined();
  });
});

describe('displayLanes', () => {
  it('should return complete lane mappings object', () => {
    const mappings: LaneMappings = displayLanes();

    expect(mappings).toBeDefined();
    expect(typeof mappings).toBe('object');
    expect(Object.keys(mappings).length).toBeGreaterThan(0);
  });

  it('should include common lane shortcuts', () => {
    const mappings = displayLanes();

    // Test some common shortcuts
    expect(mappings).toHaveProperty('jg');
    expect(mappings).toHaveProperty('mid');
    expect(mappings).toHaveProperty('sup');
    expect(mappings).toHaveProperty('top');
    expect(mappings).toHaveProperty('bot');
  });

  it('should map shortcuts to canonical values correctly', () => {
    const mappings = displayLanes();

    expect(mappings['jg']).toBe('jungle');
    expect(mappings['jungle']).toBe('jungle');
    expect(mappings['mid']).toBe('middle');
    expect(mappings['middle']).toBe('middle');
  });

  it('should handle empty string for default lane (all lanes)', () => {
    const mappings = displayLanes();

    expect(mappings['']).toBeDefined();
  });
});
