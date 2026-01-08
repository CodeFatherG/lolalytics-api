# LoLalytics API - TypeScript

TypeScript/Node.js library for scraping League of Legends champion statistics from [LoLalytics.com](https://lolalytics.com).

## Features

- 🎯 **7 Core Functions**: Tier lists, champion data, counters, matchups, patch notes, and utility helpers
- 🏗️ **Domain-Driven Design**: Clean architecture with bounded contexts and value objects
- ⚡ **Network Resilience**: 5s timeout, 2 retries with exponential backoff, 10 req/s rate limiting
- 📝 **Full TypeScript Support**: Complete type definitions for all functions and return values
- 🔄 **Async/Await**: Modern Promise-based API
- 🎨 **TypeScript-Idiomatic**: camelCase naming, typed interfaces, proper error handling

## Installation

```bash
npm install lolalytics-api
```

## Quick Start

```typescript
import { getTierlist, getChampionData, getCounters, matchup, patchNotes } from 'lolalytics-api';

// Get top 10 mid lane champions in Emerald+
const tierList = await getTierlist(10, 'mid', 'emerald');
console.log(tierList);
// [
//   { rank: 1, championName: 'ahri', tier: 'S+', winrate: 53.2 },
//   { rank: 2, championName: 'syndra', tier: 'S', winrate: 52.8 },
//   ...
// ]

// Get detailed champion statistics
const ahriStats = await getChampionData('ahri', 'mid', 'diamond');
console.log(ahriStats);
// {
//   championName: 'ahri',
//   winrate: 53.2,
//   pickrate: 8.5,
//   banrate: 12.3,
//   tier: 'S+',
//   rank: 1,
//   gamesPlayed: 125000
// }

// Get counter champions
const yasCounters = await getCounters(5, 'yasuo', 'platinum');
console.log(yasCounters);
// [
//   { championName: 'malphite', winrate: 55.2 },
//   { championName: 'pantheon', winrate: 54.8 },
//   ...
// ]

// Get matchup data
const matchupData = await matchup('zed', 'yasuo', 'mid', '');
console.log(matchupData);
// {
//   champion1: 'zed',
//   champion2: 'yasuo',
//   winrate: 51.5,
//   totalGames: 45000
// }

// Get patch notes
const patches = await patchNotes('all', 'emerald');
console.log(patches);
// {
//   buffed: [
//     {
//       championName: 'ahri',
//       winrateDelta: '+2.5%',
//       pickrateDelta: '+1.2%',
//       banrateDelta: '+0.5%'
//     },
//     ...
//   ],
//   nerfed: [...],
//   adjusted: [...]
// }
```

## API Reference

### Core Functions

#### `getTierlist(n, lane?, rank?): Promise<TierListDTO>`

Get tier list of top champions.

**Parameters:**
- `n` (number): Number of champions to return
- `lane` (string, optional): Lane filter (`'top'`, `'jungle'`, `'mid'`, `'bottom'`, `'support'`, or `''` for all)
- `rank` (string, optional): Rank filter (see `displayRanks()` for options, `''` defaults to Emerald+)

**Returns:** Array of tier list entries with rank, champion name, tier, and winrate

```typescript
const midTierList = await getTierlist(10, 'mid', 'diamond');
```

#### `getChampionData(champion, lane?, rank?): Promise<ChampionStatsDTO>`

Get detailed statistics for a specific champion.

**Parameters:**
- `champion` (string): Champion name
- `lane` (string, optional): Lane filter
- `rank` (string, optional): Rank filter

**Returns:** Champion statistics including winrate, pickrate, banrate, tier, rank, and games played

```typescript
const ahriStats = await getChampionData('ahri', 'mid', 'emerald');
```

#### `getCounters(n, champion, rank?): Promise<CounterDTO[]>`

Get counter champions for a specific champion.

**Parameters:**
- `n` (number): Number of counters to return
- `champion` (string): Champion to find counters for
- `rank` (string, optional): Rank filter

**Returns:** Array of counter champions with their winrates against the target

```typescript
const counters = await getCounters(5, 'yasuo', 'platinum');
```

#### `matchup(champion1, champion2, lane?, rank?): Promise<MatchupDTO>`

Get matchup data between two champions.

**Parameters:**
- `champion1` (string): First champion name
- `champion2` (string): Second champion name
- `lane` (string, optional): Lane filter
- `rank` (string, optional): Rank filter

**Returns:** Matchup statistics including winrate and total games

```typescript
const zedVsYasuo = await matchup('zed', 'yasuo', 'mid', 'diamond');
```

#### `patchNotes(category, rank?): Promise<PatchNotesDTO>`

Get patch note statistics showing champion performance changes.

**Parameters:**
- `category` (string): Change category (`'buffed'`, `'nerfed'`, `'adjusted'`, or `'all'`)
- `rank` (string, optional): Rank filter

**Returns:** Patch notes data with performance deltas

```typescript
const buffedChamps = await patchNotes('buffed', 'emerald');
const allChanges = await patchNotes('all');
```

### Utility Functions

#### `displayRanks(): RankMappings`

Get all available rank shortcuts and their canonical names.

```typescript
import { displayRanks } from 'lolalytics-api';

const ranks = displayRanks();
// { 'gm+': 'grandmaster_plus', 'dia': 'diamond', 'p': 'platinum', ... }
```

#### `displayLanes(): LaneMappings`

Get all available lane shortcuts and their canonical names.

```typescript
import { displayLanes } from 'lolalytics-api';

const lanes = displayLanes();
// { 'jg': 'jungle', 'mid': 'middle', 'sup': 'support', ... }
```

## Error Handling

The library throws typed errors for different failure scenarios:

```typescript
import {
  ValidationError,
  NetworkError,
  ParsingError
} from 'lolalytics-api';

try {
  await getChampionData('', 'mid'); // Empty champion name
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network failed after retries:', error.retryAttempts);
  } else if (error instanceof ParsingError) {
    console.error('HTML structure changed:', error.selector);
  }
}
```

## TypeScript Types

All functions return properly typed results:

```typescript
import type {
  TierListDTO,
  ChampionStatsDTO,
  CounterDTO,
  MatchupDTO,
  PatchNotesDTO
} from 'lolalytics-api';

const tierList: TierListDTO = await getTierlist(10);
const stats: ChampionStatsDTO = await getChampionData('ahri');
```

## Architecture

This library follows Domain-Driven Design principles:

- **4 Bounded Contexts**: Champion Statistics, Tier List, Matchup Analysis, Meta Tracking
- **Layered Architecture**: Domain → Infrastructure → Application → API
- **Value Objects**: Immutable, self-validating (Winrate, TierRating, etc.)
- **Network Resilience**:
  - 5 second timeout per request
  - 2 retries with exponential backoff (1s, 2s delays)
  - 10 requests/second rate limiting

For detailed architecture documentation with visual sequence diagrams, see [Architecture Documentation](./docs/README.md).

## License

MIT

## Disclaimer

This is an unofficial scraper for LoLalytics.com. Use responsibly and respect their servers.
