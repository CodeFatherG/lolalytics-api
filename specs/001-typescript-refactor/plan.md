# Implementation Plan: TypeScript Refactor

**Branch**: `001-typescript-refactor` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-typescript-refactor/spec.md`

## Summary

Refactor the Python lolalytics-api library to TypeScript/Node.js using Domain-Driven Design principles. The implementation will maintain 100% API compatibility with the existing Python implementation while introducing modern TypeScript patterns, network resilience features (5s timeout, 2 retries with exponential backoff, 10 req/s rate limiting), optional structured logging, and a DDD-based architecture organized around 4 bounded contexts: Champion Statistics, Tier List, Matchup Analysis, and Meta Tracking.

## Technical Context

**Language/Version**: TypeScript 5.3+ (targeting ES2022), Node.js 18+ LTS
**Primary Dependencies**:
- HTML Parsing: cheerio 1.0+ (lightweight, jQuery-like API)
- HTTP Client: undici 5.0+ (modern, fast, Node.js native)
- Rate Limiting: bottleneck 2.19+ (flexible rate limiting with retry support)
- Logging: pino 8.0+ (high-performance structured logging)

**Storage**: N/A (no caching, always fetch fresh data per spec)
**Testing**: Jest 29+ with ts-jest for TypeScript support
**Target Platform**: Node.js 18+ (LTS), npm package distributed for CommonJS and ES Modules
**Project Type**: Single library package with DDD bounded context structure
**Performance Goals**:
- <3s response time for tier list queries under normal network conditions
- Support 10 requests/second with rate limiting
- <100ms parsing overhead per request

**Constraints**:
- 5 second timeout per HTTP request
- Maximum 2 retries with exponential backoff (1s, 2s delays)
- No response caching (always fresh data)
- Silent logging by default (opt-in structured logging)

**Scale/Scope**:
- 7 public API functions matching Python implementation
- 4 bounded contexts with clear separation
- ~15-20 domain entities and value objects
- Support for all LoLalytics rank and lane filters

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Domain-Driven Design & Library-First Architecture

**Status**: ✅ PASS (with strategic application)

**Strategic DDD Compliance**:
- **Ubiquitous Language**: All domain terms (Champion, TierList, Matchup, Winrate, Pickrate, Banrate, PatchChange, Counter) consistently used in code, types, and documentation
- **Bounded Contexts**: 4 clearly defined contexts with explicit boundaries:
  1. Champion Statistics Context (individual champion performance)
  2. Tier List Context (meta rankings and comparisons)
  3. Matchup Analysis Context (head-to-head performance)
  4. Meta Tracking Context (patch-based changes)
- **Context Mapping**: Shared Kernel for common value objects (Winrate, RankFilter, LaneFilter); Anti-Corruption Layer for LoLalytics HTML parsing

**Tactical DDD Compliance**:
- **Entities**: Champion (identity by name), TierListEntry (identity by rank position)
- **Value Objects**: Winrate, Pickrate, Banrate, TierRating, RankFilter, LaneFilter, PerformanceDelta (all immutable)
- **Aggregates**: ChampionStatistics (root: Champion), MatchupResult (root: champion pair), PatchChange (root: champion + change type)
- **Domain Services**: TierCalculationService, MatchupAnalysisService, MetaTrendService
- **Repositories**: ChampionRepository, TierListRepository, MatchupRepository, PatchNotesRepository (abstract HTML parsing)

**Justification**: This is not added complexity but essential complexity. The library scrapes a complex domain (League of Legends statistics) with multiple interrelated concepts. DDD aligns code with domain expert mental models, making the codebase more maintainable as requirements evolve.

### Principle II: Clean Public API

**Status**: ✅ PASS

- **Minimal surface area**: Only 7 public functions exposed with TypeScript-idiomatic naming
- **Async patterns**: All functions return Promises using async/await for modern asynchronous handling
- **Type safety**: Complete TypeScript types and interfaces for all parameters and return values
- **Modern conventions**: camelCase naming, typed return objects (not plain JSON), proper error handling

### Principle III: Graceful Error Handling

**Status**: ✅ PASS

- All HTTP requests wrapped with timeout and retry logic
- HTML parsing failures caught and converted to descriptive errors
- Input validation at library boundaries with clear error messages
- Custom error types: `NetworkError`, `ParsingError`, `ValidationError`
- All errors include context (URL, parameters, retry attempts)

### Principle IV: Data Validation & Parsing Resilience

**Status**: ✅ PASS

- Value objects self-validate (e.g., Winrate rejects values outside 0-100%)
- Aggregate invariants enforced (e.g., MatchupResult ensures champion1 != champion2)
- Cheerio selectors with fallback strategies where practical
- Optional logging for unexpected HTML structure (when logging enabled)
- Consistent data structures even with incomplete source data

### Principle V: Testing

**Status**: ✅ PLANNED (User Story 4)

- Integration tests covering all 7 public API functions against live LoLalytics data
- Validation tests ensuring errors thrown before network requests
- Contract tests verifying returned data matches TypeScript DTO interfaces
- Lane/rank shortcut translation tests
- Error context verification tests (ValidationError, NetworkError, ParsingError)
- Edge case handling tests (empty results, invalid inputs, boundary conditions)
- Unit tests for value object validation and domain service logic
- Repository interface mocks for testing without network calls

### Principle VI: Dependency Minimalism

**Status**: ✅ PASS

- Only 4 core dependencies (cheerio, undici, bottleneck, pino)
- All are widely-adopted, actively-maintained, and have minimal sub-dependencies
- cheerio: 1M+ weekly downloads, 27k+ stars
- undici: Official Node.js HTTP client, 1M+ weekly downloads
- bottleneck: 500k+ weekly downloads, mature rate limiting
- pino: 1.5M+ weekly downloads, fastest JSON logger

## Project Structure

### Documentation (this feature)

```text
specs/001-typescript-refactor/
├── plan.md              # This file
├── research.md          # Phase 0: Technology research and comparisons
├── data-model.md        # Phase 1: DDD domain model definitions
├── quickstart.md        # Phase 1: Python-to-TypeScript migration guide
├── contracts/           # Phase 1: TypeScript interface definitions
│   ├── champion-statistics.ts
│   ├── tier-list.ts
│   ├── matchup-analysis.ts
│   ├── meta-tracking.ts
│   ├── value-objects.ts
│   └── index.ts
└── tasks.md             # Phase 2: Implementation tasks (generated by /speckit.tasks)
```

### Source Code (repository root)

Based on DDD bounded contexts and library-first architecture, we use a single project structure organized by domain:

```text
src/
├── domain/                          # Domain layer (pure TypeScript, no infrastructure)
│   ├── champion-statistics/         # Bounded Context 1
│   │   ├── entities/
│   │   │   ├── Champion.ts
│   │   │   └── ChampionStatistics.ts (Aggregate Root)
│   │   ├── value-objects/
│   │   │   ├── Winrate.ts
│   │   │   ├── Pickrate.ts
│   │   │   ├── Banrate.ts
│   │   │   └── TierRating.ts
│   │   ├── services/
│   │   │   └── TierCalculationService.ts
│   │   └── repositories/
│   │       └── ChampionRepository.ts (interface)
│   │
│   ├── tier-list/                   # Bounded Context 2
│   │   ├── entities/
│   │   │   ├── TierListEntry.ts
│   │   │   └── TierList.ts (Aggregate Root)
│   │   ├── services/
│   │   │   └── TierComparisonService.ts
│   │   └── repositories/
│   │       └── TierListRepository.ts (interface)
│   │
│   ├── matchup-analysis/            # Bounded Context 3
│   │   ├── entities/
│   │   │   └── MatchupResult.ts (Aggregate Root)
│   │   ├── value-objects/
│   │   │   └── CounterEffectiveness.ts
│   │   ├── services/
│   │   │   └── MatchupAnalysisService.ts
│   │   └── repositories/
│   │       └── MatchupRepository.ts (interface)
│   │
│   ├── meta-tracking/               # Bounded Context 4
│   │   ├── entities/
│   │   │   └── PatchChange.ts (Aggregate Root)
│   │   ├── value-objects/
│   │   │   ├── PerformanceDelta.ts
│   │   │   └── ChangeCategory.ts
│   │   ├── services/
│   │   │   └── MetaTrendService.ts
│   │   └── repositories/
│   │       └── PatchNotesRepository.ts (interface)
│   │
│   └── shared/                      # Shared Kernel (common value objects)
│       ├── value-objects/
│       │   ├── RankFilter.ts
│       │   └── LaneFilter.ts
│       └── errors/
│           ├── ValidationError.ts
│           ├── NetworkError.ts
│           └── ParsingError.ts
│
├── infrastructure/                  # Infrastructure layer (HTML parsing, HTTP, etc.)
│   ├── repositories/                # Repository implementations
│   │   ├── LoLalyticsChampionRepository.ts
│   │   ├── LoLalyticsTierListRepository.ts
│   │   ├── LoLalyticsMatchupRepository.ts
│   │   └── LoLalyticsPatchNotesRepository.ts
│   ├── http/                        # HTTP client abstraction
│   │   ├── HttpClient.ts
│   │   ├── RateLimiter.ts
│   │   └── RetryStrategy.ts
│   ├── parsing/                     # HTML parsing utilities
│   │   ├── CheerioParser.ts
│   │   └── SelectorStrategies.ts
│   └── logging/                     # Logging infrastructure
│       ├── Logger.ts (interface)
│       └── PinoLogger.ts (implementation)
│
├── application/                     # Application layer (orchestrates domain and infrastructure)
│   ├── services/
│   │   ├── ChampionStatisticsService.ts
│   │   ├── TierListService.ts
│   │   ├── MatchupAnalysisService.ts
│   │   └── MetaTrackingService.ts
│   └── dto/                         # Data Transfer Objects (for JSON serialization)
│       ├── ChampionStatsDTO.ts
│       ├── TierListDTO.ts
│       ├── MatchupDTO.ts
│       └── PatchNotesDTO.ts
│
├── api/                             # Public API (facade layer)
│   ├── index.ts                     # Main entry point with all public functions
│   ├── getTierlist.ts
│   ├── getCounters.ts
│   ├── getChampionData.ts
│   ├── matchup.ts
│   ├── patchNotes.ts
│   ├── displayRanks.ts
│   └── displayLanes.ts
│
└── config/                          # Configuration
    ├── defaults.ts
    └── types.ts

tests/
├── unit/                            # Unit tests for domain logic
│   ├── domain/
│   │   ├── champion-statistics/
│   │   ├── tier-list/
│   │   ├── matchup-analysis/
│   │   └── meta-tracking/
│   └── application/
│
├── integration/                     # Integration tests with live data
│   ├── api/
│   └── repositories/
│
└── contract/                        # Contract tests for JSON output
    └── api-responses.test.ts
```

**Structure Decision**:

We selected a **single library package** with **DDD layered architecture** organized by bounded contexts. This aligns with Principle I (DDD & Library-First), makes domain knowledge explicit through the directory structure, enables independent testing of domain logic, and provides a clean migration path through the `/api/` facade layer.

## Complexity Tracking

**No violations identified.** All architectural decisions align with constitution principles:

- DDD is mandated by Principle I, not a violation
- Repository pattern is mandated by Principle I (tactical patterns)
- 4 bounded contexts map directly to distinct domain areas identified in spec
- All dependencies meet Principle VI criteria (widely-adopted, minimal sub-dependencies)

## Testing Strategy (User Story 4)

**Testing Framework**: Jest 29+ with ts-jest for TypeScript support

**Test Organization**: Tests organized by public API function following the Python test structure but adapted for TypeScript/Jest patterns.

### Test Categories

#### 1. Integration Tests (Primary Focus)

**Location**: `tests/integration/api/`

These tests replicate the Python test coverage by calling public APIs against live LoLalytics data. Each test verifies:
- Function accepts valid inputs
- Returned data structure matches TypeScript DTO interface
- All required fields are present
- Data types are correct

**Files**:
- `getTierlist.test.ts` - Tests for getTierlist() with various lane/rank combinations
- `getChampionData.test.ts` - Tests for getChampionData() with different champions
- `getCounters.test.ts` - Tests for getCounters() functionality
- `matchup.test.ts` - Tests for matchup() between champion pairs
- `patchNotes.test.ts` - Tests for patchNotes() with all categories
- `displayUtilities.test.ts` - Tests for displayRanks() and displayLanes()

#### 2. Validation Tests

**Location**: `tests/integration/api/validation.test.ts`

Tests that verify input validation happens BEFORE network requests:
- Empty champion names throw ValidationError
- Invalid lane shortcuts throw ValidationError with helpful message
- Invalid rank shortcuts throw ValidationError with helpful message
- Invalid patch note categories throw ValidationError

**Key Principle**: These tests MUST NOT make actual HTTP requests. They verify validation fails fast.

#### 3. Error Context Tests

**Location**: `tests/integration/api/errors.test.ts`

Tests that verify error objects include proper context:
- ValidationError includes `parameterName` and `invalidValue`
- Error messages are descriptive and actionable
- All custom errors extend Error properly

#### 4. Unit Tests (Optional but Recommended)

**Location**: `tests/unit/domain/`

Tests for domain logic without network calls:
- Value object validation (Winrate rejects >100%, Pickrate validation, etc.)
- Aggregate invariants (MatchupResult ensures champion1 != champion2)
- Domain service logic
- TierRating calculations

### Test Data Strategy

**Live Data**: Integration tests use real LoLalytics data with well-known champions ('ahri', 'yasuo', 'jax') that are stable fixtures in the game.

**No Mocking for Integration**: Integration tests make real HTTP calls to verify end-to-end behavior. This catches HTML structure changes early.

**Fast Validation Tests**: Validation tests use mocks/stubs to avoid network calls and run quickly.

### Coverage Goals

- ✅ All 7 public API functions have integration tests
- ✅ All validation paths have tests (empty strings, invalid shortcuts)
- ✅ All lane shortcuts tested ('top', 'jg', 'jungle', 'mid', 'middle', 'bot', 'bottom', 'adc', 'support', 'sup')
- ✅ All rank shortcuts tested ('gm+', 'dia', 'd+', 'p', 'emerald', etc.)
- ✅ Error types verified (ValidationError, NetworkError, ParsingError)
- ✅ DTO structure compliance verified for all return types

### Test Execution

```bash
npm test                  # Run all tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
```

### Python Test Migration Map

| Python Test | TypeScript Equivalent | Notes |
|-------------|----------------------|-------|
| `test_invalid_lane_raises_error` | `getTierlist.test.ts` - validation suite | Uses Jest's `expect().rejects.toThrow()` |
| `test_invalid_rank_raises_error` | `getTierlist.test.ts` - validation suite | Verifies ValidationError type |
| `test_lane_shortcuts` | `getTierlist.test.ts` - shortcuts suite | Tests all lane variations |
| `test_get_tierlist_returns_json` | `getTierlist.test.ts` - structure suite | Verifies TierListDTO interface |
| `test_empty_champion_raises_error` | `getCounters.test.ts` - validation suite | Async error handling |
| `test_get_counters_returns_json` | `getCounters.test.ts` - structure suite | Verifies CounterDTO array |
| `test_champion_data` | `getChampionData.test.ts` - integration suite | Verifies ChampionStatsDTO |
| `test_matchup` | `matchup.test.ts` - integration suite | Verifies MatchupDTO |
| `test_patch_notes` | `patchNotes.test.ts` - integration suite | Verifies PatchNotesDTO |

### Key Differences from Python Tests

1. **TypeScript Types**: Tests verify returned data matches TypeScript interfaces (TierListDTO, ChampionStatsDTO, etc.) rather than just checking JSON keys
2. **Async/Await**: All tests use async/await patterns instead of Python's synchronous calls
3. **Error Types**: Tests verify specific error class types (ValidationError) not just error messages
4. **Jest Matchers**: Uses Jest-specific matchers like `toHaveProperty()`, `toMatchObject()`, `toBeInstanceOf()`
5. **Describe Blocks**: Tests organized in describe/it blocks following Jest conventions
6. **Type Safety**: TypeScript catches type errors at compile time, tests focus on runtime behavior

## Documentation Strategy (User Story 5)

**Documentation Format**: Mermaid.js sequence diagrams in Markdown files

**Documentation Location**: `docs/` directory at repository root

**Purpose**: Provide visual understanding of execution flows for AI-generated DDD architecture to aid developer onboarding and long-term maintainability

### Diagram Categories

#### 1. API Function Sequence Diagrams (7 diagrams)

**Location**: `docs/sequence-*.md`

One diagram for each public API function showing complete execution flow:

**Files**:
- `sequence-getTierlist.md` - Tier list retrieval flow
- `sequence-getChampionData.md` - Champion statistics flow with error paths
- `sequence-getCounters.md` - Counter champions flow
- `sequence-matchup.md` - Matchup analysis flow
- `sequence-patchNotes.md` - Patch notes retrieval flow
- `sequence-displayRanks.md` - Utility function (simple flow)
- `sequence-displayLanes.md` - Utility function (simple flow)

**Each diagram shows**:
1. **Participants**: User/Client, API Function, Application Service, Value Objects, Domain Entities, Repository, HttpClient, RateLimiter, LoLalytics.com
2. **Happy Path**: Successful flow from API call → DTO return
3. **Validation**: Input validation and ValidationError creation
4. **Domain Logic**: Value object creation, aggregate construction
5. **Infrastructure**: HTTP request with rate limiting, HTML parsing
6. **Error Paths** (where relevant): ValidationError, NetworkError, ParsingError propagation

**Diagram Structure**:
```
Line 1: ```mermaid
Line 2: sequenceDiagram
Line 3-N: Mermaid syntax (participants, arrows, notes)
Last line: ```
EOF: newline
```

#### 2. Architecture Overview Diagrams (3 diagrams)

**Location**: `docs/architecture-*.md`

High-level architectural diagrams:

**Files**:
- `architecture-overview.md` - Complete system overview
  - Shows all 4 bounded contexts (Champion Statistics, Tier List, Matchup Analysis, Meta Tracking)
  - Shows shared kernel (RankFilter, LaneFilter, Errors)
  - Shows external dependency (LoLalytics.com)

- `architecture-layers.md` - DDD layer dependencies
  - API Layer (public functions)
  - Application Layer (services, DTOs)
  - Domain Layer (entities, value objects, aggregates, domain services)
  - Infrastructure Layer (repositories, HTTP, parsing, logging)
  - Shows dependency direction: API → Application → Domain ← Infrastructure

- `architecture-bounded-contexts.md` - Context map
  - 4 bounded contexts with clear boundaries
  - Shared Kernel (common value objects and errors)
  - Anti-Corruption Layer (repository implementations)
  - Context relationships

#### 3. Cross-Cutting Concern Diagrams (2 diagrams)

**Location**: `docs/sequence-*.md`

Specialized diagrams for infrastructure patterns:

**Files**:
- `sequence-error-handling.md` - Error flow patterns
  - ValidationError at application layer (before network)
  - NetworkError from HttpClient (after retries)
  - ParsingError from repository (unexpected HTML)
  - Error propagation through layers
  - Error context fields (parameterName, url, retryAttempts, selector)

- `sequence-rate-limiting.md` - Network resilience
  - RateLimiter queuing with Bottleneck (10 req/s)
  - RetryStrategy with exponential backoff (1s, 2s)
  - HttpClient timeout enforcement (5s)
  - Request/response cycle with retries

### Mermaid Syntax Standards

**Participant Naming**:
- Use actual class/module names from codebase
- Format: `participant ServiceName as "Descriptive Label"`
- Example: `participant ChampionStatsService as "Application Service"`

**Arrow Types**:
- `->>` : Synchronous call
- `-->>` : Return response
- `-x` : Error/exception throw
- `--x` : Error return

**Notes**:
- Use `Note over Participant: Text` for DDD pattern explanations
- Use `Note right of Participant: Text` for inline comments
- Explain: Value Object validation, Aggregate invariants, Anti-Corruption Layer parsing

**Activation Boxes**:
- Use `activate`/`deactivate` to show component lifecycle
- Example:
  ```
  activate Repository
  Repository->>HttpClient: fetchHtml(url)
  deactivate Repository
  ```

**Error Paths**:
- Use `alt`/`else` blocks for conditional flows
- Example:
  ```
  alt Empty champion name
      Service-xUser: ValidationError
  else Valid champion
      Service->>Repository: findByName()
  end
  ```

### Documentation Value Proposition

**For New Developers**:
- Understand DDD architecture without reading entire codebase
- See how layers interact visually
- Understand error handling patterns
- Learn the "why" behind architectural decisions

**For Maintainers**:
- Quickly locate where logic happens (which layer, which class)
- Understand impact of changes across layers
- Verify that changes maintain architectural integrity
- Reference when HTML parsing breaks (see exact parsing flow)

**For AI-Generated Code**:
- Document intent and design decisions
- Provide reference for future refactoring
- Show patterns that should be followed in new features
- Bridge gap between generated code and human understanding
