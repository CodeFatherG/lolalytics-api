import { getChampionData } from '../src/api/getChampionData.js';

/**
 * Example: Fetch all statistics for Jinx in ADC lane at Platinum+ rank
 *
 * This demonstrates:
 * - Using getChampionData() with lane and rank parameters
 * - Accessing all available statistics from ChampionStatsDTO
 * - Formatting output for readability
 */
async function main() {
  try {
    console.log('Fetching Jinx statistics for ADC lane at Platinum+...\n');

    // Fetch champion data
    const stats = await getChampionData('jinx', 'adc', 'p+');

    // Display all statistics
    console.log('='.repeat(50));
    console.log(`Champion: ${stats.championName.toUpperCase()}`);
    console.log('='.repeat(50));
    console.log();

    console.log('Core Statistics:');
    console.log(`  Winrate:        ${stats.winrate.toFixed(2)}%`);
    console.log(`  Pickrate:       ${stats.pickrate.toFixed(2)}%`);
    console.log(`  Banrate:        ${stats.banrate.toFixed(2)}%`);
    console.log(`  Games Played:   ${stats.gamesPlayed.toLocaleString()}`);
    console.log();

    console.log('Tier Information:');
    console.log(`  Tier Rating:    ${stats.tier}`);
    console.log(`  Rank:           #${stats.rank}`);
    console.log();

    // Display optional patch note data if available
    if (stats.winrateDelta !== undefined && stats.winrateDelta !== null) {
      console.log('Patch Performance:');
      console.log(`  Winrate Delta:  ${stats.winrateDelta}`);
      if (stats.gameAverageWinrate !== undefined && stats.gameAverageWinrate !== null) {
        console.log(`  Game Average:   ${stats.gameAverageWinrate}`);
      }
      console.log();
    }

    console.log('='.repeat(50));

    // Interpretation
    console.log();
    console.log('Interpretation:');
    if (stats.winrate > 52) {
      console.log('  Strong pick - above average winrate');
    } else if (stats.winrate > 48) {
      console.log('  Balanced pick - average winrate');
    } else {
      console.log('  Weak pick - below average winrate');
    }

    if (stats.pickrate > 10) {
      console.log('  Very popular - high pick rate');
    } else if (stats.pickrate > 5) {
      console.log('  Popular - moderate pick rate');
    } else {
      console.log('  Niche pick - low pick rate');
    }

    if (stats.banrate > 20) {
      console.log('  Frequently banned - high ban rate');
    } else if (stats.banrate > 10) {
      console.log('  Sometimes banned - moderate ban rate');
    } else {
      console.log('  Rarely banned - low ban rate');
    }

  } catch (error) {
    console.error('Error fetching Jinx statistics:');
    console.error(error);
    process.exit(1);
  }
}

// Run the example
main();
