# LoLalytics API Examples

This directory contains example scripts demonstrating how to use the lolalytics-api library.

## Running Examples

### Using tsx (TypeScript execution)

```bash
npx tsx examples/jinx-stats.ts
```

### Using compiled JavaScript

```bash
npm run build
node dist/cjs/examples/jinx-stats.js
```

## Available Examples

### [jinx-stats.ts](jinx-stats.ts)

Fetches and displays all available statistics for Jinx in the ADC lane at Platinum+ rank.

**What it demonstrates:**
- Using `getChampionData()` with lane and rank parameters
- Accessing all properties from ChampionStatsDTO
- Formatting output for readability
- Handling optional fields (winrateDelta, gameAverageWinrate)
- Interpreting statistics (winrate strength, popularity, ban rate)

**Output includes:**
- Core statistics: winrate, pickrate, banrate, games played
- Tier information: tier rating, rank position
- Patch performance: winrate delta, game average (when available)
- Interpretation: pick strength analysis

**Run it:**
```bash
npx tsx examples/jinx-stats.ts
```

## Quick Examples

### Get Champion Data

```typescript
import { getChampionData } from 'lolalytics-api';

const stats = await getChampionData('jinx', 'adc', 'p+');

console.log(`${stats.championName}: ${stats.winrate}% winrate (#${stats.rank})`);
// Output: jinx: 51.41% winrate (#10)
```

### Get Tier List

```typescript
import { getTierlist } from 'lolalytics-api';

const topMids = await getTierlist(5, 'mid', 'emerald');

topMids.forEach(entry => {
  console.log(`#${entry.rank} ${entry.championName} (${entry.tier}) - ${entry.winrate}%`);
});
```

### Get Counter Champions

```typescript
import { getCounters } from 'lolalytics-api';

const counters = await getCounters(3, 'yasuo', 'diamond');

console.log('Top 3 Yasuo counters:');
counters.forEach(counter => {
  console.log(`  ${counter.championName}: ${counter.winrate}% winrate against Yasuo`);
});
```

### Get Matchup Data

```typescript
import { matchup } from 'lolalytics-api';

const result = await matchup('zed', 'yasuo', 'mid', 'master');

console.log(`${result.champion1} vs ${result.champion2}: ${result.winrate}% (${result.totalGames} games)`);
```

### Get Patch Notes

```typescript
import { patchNotes } from 'lolalytics-api';

const changes = await patchNotes('buffed', 'emerald');

console.log('Buffed champions:');
changes.buffed.forEach(champ => {
  console.log(`  ${champ.championName}: ${champ.winrateDelta} winrate change`);
});
```

### Display Utilities

```typescript
import { displayRanks, displayLanes } from 'lolalytics-api';

// Show all available rank shortcuts
const ranks = displayRanks();
console.log('Available ranks:', Object.keys(ranks));
// Output: ['gm+', 'dia', 'p', 'platinum', 'emerald', ...]

// Show all available lane shortcuts
const lanes = displayLanes();
console.log('Available lanes:', Object.keys(lanes));
// Output: ['jg', 'jungle', 'mid', 'middle', 'bot', 'adc', ...]
```

## Error Handling

All functions throw typed errors:

```typescript
import {
  getChampionData,
  ValidationError,
  NetworkError,
  ParsingError
} from 'lolalytics-api';

try {
  const stats = await getChampionData('jinx', 'adc', 'p+');
  console.log(stats);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
    console.error('Parameter:', error.parameterName);
  } else if (error instanceof NetworkError) {
    console.error('Network failed after retries:', error.retryAttempts);
    console.error('URL:', error.url);
  } else if (error instanceof ParsingError) {
    console.error('HTML structure changed:', error.selector);
    console.error('URL:', error.url);
  }
}
```

## Next Steps

- See the main [README.md](../README.md) for full API documentation
- Explore [docs/](../docs/) for architecture diagrams and execution flows
- Run `npm test` to see comprehensive test examples
