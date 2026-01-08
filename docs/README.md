# Architecture Documentation

This directory contains visual documentation of the LoLalytics API architecture and execution flows using Mermaid.js sequence diagrams.

## Purpose

These diagrams help developers understand:
- How the DDD (Domain-Driven Design) layers interact
- The complete execution path from API call to response
- Error handling patterns across all layers
- Network resilience mechanisms (rate limiting, retries, timeouts)

## Diagram Categories

### API Function Sequence Diagrams

Complete execution flows for each public API function:

- [getTierlist](./sequence-getTierlist.md) - Tier list retrieval flow
- [getChampionData](./sequence-getChampionData.md) - Champion statistics with error paths
- [getCounters](./sequence-getCounters.md) - Counter champions flow
- [matchup](./sequence-matchup.md) - Matchup analysis flow
- [patchNotes](./sequence-patchNotes.md) - Patch notes retrieval flow
- [displayRanks](./sequence-displayRanks.md) - Rank utility function
- [displayLanes](./sequence-displayLanes.md) - Lane utility function

### Architecture Overview Diagrams

High-level architectural views:

- [Architecture Overview](./architecture-overview.md) - All bounded contexts and shared kernel
- [Layer Dependencies](./architecture-layers.md) - DDD layer structure
- [Bounded Contexts](./architecture-bounded-contexts.md) - Context map with Anti-Corruption Layer

### Cross-Cutting Concerns

Infrastructure patterns:

- [Error Handling](./sequence-error-handling.md) - ValidationError, NetworkError, ParsingError flows
- [Rate Limiting](./sequence-rate-limiting.md) - Bottleneck, RetryStrategy, timeout enforcement

## How to Read the Diagrams

### Participants

Diagrams show interactions between these components:

- **User/Client** - External caller
- **API Function** - Public function entry point (getTierlist, getChampionData, etc.)
- **Application Service** - Orchestration layer (ChampionStatisticsService, TierListService, etc.)
- **Value Objects** - Immutable domain objects (RankFilter, LaneFilter, Winrate, etc.)
- **Domain Entities** - Business objects with identity (Champion, ChampionStatistics, TierList, etc.)
- **Repository** - Data access abstraction (LoLalyticsChampionRepository, etc.)
- **HttpClient** - HTTP infrastructure with rate limiting
- **RateLimiter** - Request throttling (10 req/s)
- **LoLalytics.com** - External data source

### Arrow Types

- `->` : Synchronous call
- `-->` : Return response
- `-x` : Error/exception throw
- `--x` : Error return

### DDD Layers

The diagrams show four distinct layers:

1. **API Layer** - Public functions (facade pattern)
2. **Application Layer** - Services orchestrating use cases, DTOs for serialization
3. **Domain Layer** - Pure business logic (entities, value objects, aggregates, domain services)
4. **Infrastructure Layer** - External concerns (HTTP, parsing, logging, repositories)

**Key Pattern**: API → Application → Domain ← Infrastructure

The Domain layer has no dependencies on Infrastructure. Infrastructure implements domain interfaces.

### DDD Patterns Illustrated

- **Value Object Validation** - Immutable objects that validate themselves (e.g., RankFilter.from())
- **Aggregate Creation** - Entities with invariants (e.g., ChampionStatistics.create())
- **Anti-Corruption Layer** - Repositories protect domain from HTML structure changes

## Viewing the Diagrams

### In VS Code

1. Install the "Markdown Preview Mermaid Support" extension
2. Open any `.md` file from this directory
3. Use `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac) to preview

### On GitHub

Mermaid diagrams render automatically when viewing `.md` files on GitHub.

### Online Mermaid Editor

Copy the diagram content (between `` ```mermaid`` and `` ``` ``) and paste into:
https://mermaid.live/

## For Maintainers

When making architectural changes:

1. Update the relevant sequence diagram to reflect new flow
2. Verify diagrams still render correctly in VS Code and GitHub
3. Ensure participant names match actual class/module names in code
4. Add notes explaining significant DDD patterns or decisions

## Additional Resources

- [Main README](../README.md) - Library usage and API documentation
- [spec.md](../specs/001-typescript-refactor/spec.md) - Feature specification
- [plan.md](../specs/001-typescript-refactor/plan.md) - Technical architecture plan
