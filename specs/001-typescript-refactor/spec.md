# Feature Specification: TypeScript Refactor

**Feature Branch**: `001-typescript-refactor`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "Refactor python project for scraping lolalytics website statistics to a node.js enviroment using typescript"

## Clarifications

### Session 2026-01-08

- Q: When fetching data from LoLalytics, what timeout and retry strategy should be used for slow or unresponsive network conditions? → A: Short timeout (5s), 2 retries with exponential backoff
- Q: To be a good citizen and avoid overwhelming LoLalytics servers, should the library implement rate limiting on outgoing requests? → A: Basic rate limiting (max 10 requests/second)
- Q: Should the library cache responses from LoLalytics to reduce redundant requests and improve performance? → A: No caching - Always fetch fresh data
- Q: Should the library provide logging capabilities to help developers debug issues and monitor API usage? → A: Optional structured logging with log levels
- Q: When a user provides an invalid champion name (e.g., 'notachampion'), how should the library respond? → A: Make request and return empty result

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Data Retrieval Functions (Priority: P1)

As a developer using this library, I need to retrieve basic League of Legends statistics (tier lists, champion data, counters, matchup data) through simple function calls so that I can integrate LoLalytics data into my application without dealing with web scraping complexities.

**Why this priority**: This is the core value proposition of the library. These functions represent the primary use cases that existing Python users rely on. Without these, there is no viable product.

**Independent Test**: Can be fully tested by importing the library, calling each function with valid parameters (e.g., `getTierlist(10, 'mid', 'emerald')`, `getChampionData('ahri')`), and verifying that structured JSON data is returned with the expected fields.

**Acceptance Scenarios**:

1. **Given** the library is installed, **When** a user calls `getTierlist(10, 'mid', 'emerald')`, **Then** the system returns JSON with 10 champions containing rank, champion name, tier, and winrate fields
2. **Given** the library is installed, **When** a user calls `getChampionData('ahri', 'mid', 'emerald')`, **Then** the system returns JSON with winrate, pickrate, banrate, tier, rank, and games played
3. **Given** the library is installed, **When** a user calls `getCounters(5, 'yasuo', 'diamond')`, **Then** the system returns JSON with 5 counter champions and their winrates against Yasuo
4. **Given** the library is installed, **When** a user calls `matchup('zed', 'yasuo', 'mid')`, **Then** the system returns JSON with winrate and number of games for that specific matchup
5. **Given** the library is installed, **When** a user provides an empty champion name to functions requiring it, **Then** the system throws a clear validation error before making any network requests

---

### User Story 2 - Configuration & Utility Functions (Priority: P2)

As a developer using this library, I need helper functions to discover valid input values (ranks, lanes) and understand input shortcuts so that I can use the API correctly without constantly referring to documentation.

**Why this priority**: These utilities improve developer experience and reduce errors, but the core data retrieval functions can work without them if users reference documentation for valid values.

**Independent Test**: Can be tested by calling `displayRanks()` and `displayLanes()` functions and verifying they return complete mappings of shortcuts to canonical values (e.g., 'gm+' maps to 'grandmaster_plus', 'jg' maps to 'jungle').

**Acceptance Scenarios**:

1. **Given** the library is installed, **When** a user calls `displayRanks()`, **Then** the system returns a complete mapping of all rank shortcuts to canonical rank names
2. **Given** the library is installed, **When** a user calls `displayLanes()`, **Then** the system returns a complete mapping of all lane shortcuts to canonical lane names
3. **Given** a user provides a rank shortcut like 'gm+' to any data retrieval function, **When** the function processes the request, **Then** it correctly translates 'gm+' to 'grandmaster_plus' and applies the appropriate filter

---

### User Story 3 - Patch Notes & Meta Changes (Priority: P3)

As a developer building League of Legends analytics tools, I need to retrieve patch note statistics showing which champions were buffed, nerfed, or adjusted with their performance deltas so that I can track meta shifts and champion balance changes over time.

**Why this priority**: This is a valuable feature for meta-tracking applications, but it's supplementary to the core champion statistics functionality. Users can still build useful applications without patch note tracking.

**Independent Test**: Can be tested by calling `patchNotes('all')` or `patchNotes('buffed', 'emerald')` and verifying the returned JSON contains categorized lists of champions with winrate, pickrate, and banrate changes.

**Acceptance Scenarios**:

1. **Given** the library is installed, **When** a user calls `patchNotes('all')`, **Then** the system returns JSON with three categories (buffed, nerfed, adjusted), each containing champions and their performance deltas
2. **Given** the library is installed, **When** a user calls `patchNotes('buffed', 'diamond')`, **Then** the system returns only buffed champions filtered by Diamond rank with their winrate, pickrate, and banrate changes
3. **Given** the library is installed, **When** a user calls `patchNotes('nerfed')`, **Then** the system returns only nerfed champions with their performance metrics

---

### User Story 4 - Comprehensive Testing Suite (Priority: P4)

As a developer maintaining this library, I need a comprehensive Jest test suite that validates all public APIs, error handling, input validation, and edge cases so that I can confidently make changes without breaking existing functionality and ensure the library behaves correctly across all scenarios.

**Why this priority**: Testing provides confidence in refactoring, catches regressions, and documents expected behavior. While critical for long-term maintainability, the library can function without tests initially. This phase replicates Python test coverage in Jest with TypeScript-idiomatic patterns.

**Independent Test**: Run `npm test` and verify all test suites pass with adequate coverage of:
- All 7 public API functions return correctly structured data
- Input validation catches invalid parameters before making network requests
- Error handling properly throws typed errors for network failures, parsing issues, and validation problems
- Edge cases like empty results, invalid champion names, and boundary conditions are handled gracefully

**Acceptance Scenarios**:

1. **Given** the test suite is configured, **When** running tests for getTierlist(), **Then** tests verify:
   - Valid lane shortcuts are accepted ('top', 'jg', 'mid', 'bot', 'sup')
   - Invalid lanes throw ValidationError with clear message
   - Invalid ranks throw ValidationError with clear message
   - Returned data structure matches TierListDTO interface with rank, champion, tier, winrate fields
   - Requesting more items than available returns all available items without error

2. **Given** the test suite is configured, **When** running tests for getChampionData(), **Then** tests verify:
   - Valid champion name returns ChampionStatsDTO with all required fields (winrate, pickrate, banrate, tier, rank, games)
   - Empty champion name throws ValidationError before network request
   - Rank and lane shortcuts are correctly translated
   - Optional parameters default correctly (empty rank → Emerald+, empty lane → all lanes)

3. **Given** the test suite is configured, **When** running tests for getCounters(), **Then** tests verify:
   - Valid champion name returns array of CounterDTO objects
   - Empty champion name throws ValidationError
   - Returned counters include champion names and winrates

4. **Given** the test suite is configured, **When** running tests for matchup(), **Then** tests verify:
   - Valid champion pair returns MatchupDTO with winrate and game count
   - Empty champion names throw ValidationError
   - Data structure matches expected interface

5. **Given** the test suite is configured, **When** running tests for patchNotes(), **Then** tests verify:
   - 'all' category returns buffed, nerfed, and adjusted arrays
   - Individual categories ('buffed', 'nerfed', 'adjusted') filter correctly
   - Invalid category throws ValidationError
   - Returned data matches PatchNotesDTO structure

6. **Given** the test suite is configured, **When** running tests for displayRanks() and displayLanes(), **Then** tests verify:
   - displayRanks() returns complete mapping object with all shortcuts
   - displayLanes() returns complete mapping object with all shortcuts
   - Specific shortcuts map to correct canonical values

7. **Given** the test suite is configured, **When** running tests for error handling, **Then** tests verify:
   - ValidationError includes parameterName and invalidValue context
   - NetworkError includes url and retryAttempts context (when simulated)
   - ParsingError includes url and selector context (when simulated)
   - All errors extend Error class properly

---

### User Story 5 - Sequence Diagram Documentation (Priority: P5)

As a developer onboarding to this codebase or maintaining it long-term, I need visual sequence diagrams documenting the execution flow of each public API function so that I can quickly understand how the DDD layers interact, what the data flow looks like, and how AI-generated code achieves its outcomes without reading through the entire implementation.

**Why this priority**: Documentation is essential for maintainability and onboarding but can be created after the code is working. Sequence diagrams provide visual understanding of complex layered architectures and make the DDD pattern clearer. This is especially valuable for AI-generated code where understanding the intent and flow is crucial.

**Independent Test**: Navigate to `docs/` directory and verify Mermaid.js sequence diagrams exist for all 7 public functions, each diagram renders correctly in Markdown viewers (GitHub, VS Code), and diagrams accurately reflect the code execution path through all layers (API → Application → Domain → Infrastructure).

**Acceptance Scenarios**:

1. **Given** the documentation is complete, **When** a developer opens `docs/sequence-getTierlist.md`, **Then** they see a Mermaid sequence diagram showing:
   - User/Client calls getTierlist()
   - API layer creates dependencies (RateLimiter, HttpClient, Repository, Service)
   - Application service validates inputs and creates value objects (LaneFilter, RankFilter)
   - Repository fetches HTML via HttpClient with rate limiting and retry logic
   - Repository parses HTML and constructs domain entities (TierList, TierListEntry)
   - Application service converts domain objects to DTO
   - Response returns through layers back to user

2. **Given** the documentation is complete, **When** a developer opens `docs/sequence-getChampionData.md`, **Then** they see a Mermaid sequence diagram showing:
   - Complete flow from API call through validation, value object creation, HTTP fetch, HTML parsing, domain entity construction, and DTO conversion
   - Error paths for ValidationError (empty champion name)
   - Error paths for NetworkError (timeouts, retries)
   - Error paths for ParsingError (missing HTML elements)

3. **Given** the documentation is complete, **When** a developer opens `docs/sequence-error-handling.md`, **Then** they see a Mermaid sequence diagram showing:
   - How ValidationError is thrown at application layer before network calls
   - How NetworkError is thrown by HttpClient after retry exhaustion
   - How ParsingError is thrown by repository when HTML structure is unexpected
   - Error propagation through layers back to caller

4. **Given** the documentation is complete, **When** a developer opens `docs/sequence-rate-limiting.md`, **Then** they see a Mermaid sequence diagram showing:
   - HttpClient queuing requests with RateLimiter
   - Bottleneck enforcing 10 req/s limit
   - RetryStrategy handling failures with exponential backoff
   - Request timeout enforcement (5 seconds)

5. **Given** the documentation is complete, **When** a developer opens any sequence diagram, **Then** the file:
   - Starts with `` ```mermaid`` on line 1
   - Ends with `` ``` `` on the last line (before EOF newline)
   - Uses proper Mermaid sequenceDiagram syntax
   - Includes all major components: API layer, Application layer, Domain layer, Infrastructure layer
   - Shows both happy path and error paths where relevant
   - Includes notes explaining key decisions or DDD patterns

6. **Given** the documentation is complete, **When** a developer wants to understand DDD architecture, **Then** they can open `docs/architecture-overview.md` to see:
   - High-level diagram showing all 4 bounded contexts
   - Diagram showing layer dependencies (API → Application → Domain ← Infrastructure)
   - Diagram showing shared kernel components used across contexts

7. **Given** the documentation is complete, **When** viewing diagrams in VS Code or GitHub, **Then**:
   - All Mermaid diagrams render correctly as visual flowcharts
   - Participant names are clear and match code structure
   - Arrows show correct message flow direction
   - Notes provide context for complex operations

---

### Edge Cases

- What happens when LoLalytics changes their HTML structure? The system should fail gracefully with a clear error message indicating parsing failure rather than returning incorrect or partial data
- What happens when a user provides an invalid champion name (e.g., 'notachampion')? The system should make the request to LoLalytics and return an empty result set if no data is found, allowing LoLalytics to be the source of truth for valid champion names
- What happens when a user provides invalid rank or lane shortcuts? The system should throw a validation error with a clear message listing valid options
- What happens when network requests fail or timeout? The system should retry up to 2 times with exponential backoff (1s, 2s), then throw a network error with appropriate context including the number of retry attempts made
- What happens when a user requests more items than available (e.g., `getTierlist(999)`)? The system should return all available items without error
- What happens when optional parameters are omitted? The system should apply sensible defaults (e.g., '' for rank defaults to Emerald+, '' for lane means all lanes)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a `getTierlist(n, lane, rank)` function that returns the top N champions with rank, name, tier, and winrate
- **FR-002**: System MUST provide a `getCounters(n, champion, rank)` function that returns the top N counter champions with names and winrates
- **FR-003**: System MUST provide a `getChampionData(champion, lane, rank)` function that returns detailed champion statistics including winrate, pickrate, banrate, tier, rank, and games played
- **FR-004**: System MUST provide a `matchup(champion1, champion2, lane, rank)` function that returns winrate and number of games for a specific champion matchup
- **FR-005**: System MUST provide a `patchNotes(category, rank)` function that returns champion performance changes categorized as buffed, nerfed, or adjusted
- **FR-006**: System MUST provide `displayRanks()` and `displayLanes()` utility functions that return mappings of shortcuts to canonical values
- **FR-007**: System MUST validate all required parameters (champion names, categories) before making network requests and throw clear validation errors for missing or invalid inputs
- **FR-008**: System MUST support rank shortcuts (e.g., 'gm+', 'dia', 'p') and translate them to canonical LoLalytics rank parameter values
- **FR-009**: System MUST support lane shortcuts (e.g., 'jg', 'sup', 'adc') and translate them to canonical LoLalytics lane parameter values
- **FR-010**: System MUST return data in structured TypeScript-idiomatic format using proper types, interfaces, and modern JavaScript/TypeScript conventions (camelCase, async/await, Promises)
- **FR-011**: System MUST handle HTTP errors (4xx, 5xx) gracefully by throwing descriptive errors rather than crashing
- **FR-012**: System MUST handle HTML parsing failures gracefully by throwing descriptive errors when expected elements are not found
- **FR-021**: System MUST implement HTTP request timeout of 5 seconds for all LoLalytics requests
- **FR-022**: System MUST retry failed requests up to 2 times using exponential backoff (delays: 1s, 2s) before throwing timeout error
- **FR-023**: System MUST implement rate limiting of maximum 10 requests per second to LoLalytics to prevent server overload
- **FR-024**: System MUST provide optional structured logging with configurable log levels (error, warn, info, debug)
- **FR-025**: System MUST default to silent logging (no output) unless explicitly enabled by the user
- **FR-026**: System MUST log errors with context (URL, parameters, retry attempts) when requests fail or parsing errors occur
- **FR-027**: System MUST allow requests with any champion name and return empty results for invalid champions, letting LoLalytics determine validity
- **FR-013**: System MUST provide 7 public functions (getTierlist, getCounters, getChampionData, matchup, patchNotes, displayRanks, displayLanes) following TypeScript naming conventions and async/await patterns
- **FR-014**: System MUST use default values for optional parameters: empty string for rank defaults to Emerald+, empty string for lane means all lanes
- **FR-015**: System MUST export all public functions as a module interface for easy import in consuming applications
- **FR-016**: System MUST organize code using Domain-Driven Design bounded contexts (Champion Statistics, Tier List, Matchup Analysis, Meta Tracking)
- **FR-017**: System MUST use ubiquitous language throughout codebase (Champion, TierList, Matchup, Winrate, Pickrate, Banrate, etc.)
- **FR-018**: System MUST model domain concepts as aggregates with clear boundaries and invariants (e.g., ChampionStatistics aggregate, MatchupResult aggregate)
- **FR-019**: System MUST use value objects for domain concepts without identity (e.g., Winrate, TierRating, RankFilter as immutable types)
- **FR-020**: System MUST separate domain logic from infrastructure concerns through repository pattern (e.g., ChampionRepository abstracts HTML parsing)

### Testing Requirements (User Story 4)

- **FR-028**: System MUST include Jest test suite covering all 7 public API functions (getTierlist, getChampionData, getCounters, matchup, patchNotes, displayRanks, displayLanes)
- **FR-029**: System MUST include integration tests that verify each public function returns data matching its TypeScript interface definition
- **FR-030**: System MUST include validation tests that verify invalid inputs throw appropriate ValidationError before network requests
- **FR-031**: System MUST include tests verifying lane shortcuts ('top', 'jg', 'mid', 'bot', 'sup', etc.) are correctly accepted
- **FR-032**: System MUST include tests verifying rank shortcuts ('gm+', 'dia', 'p+', etc.) are correctly translated
- **FR-033**: System MUST include tests verifying empty champion names throw ValidationError with descriptive message
- **FR-034**: System MUST include tests verifying error objects include proper context (parameterName, url, selector, etc.)
- **FR-035**: System MUST include tests verifying data structure compliance (returned objects match DTO interfaces)
- **FR-036**: System MUST organize tests by API function with descriptive test names following Jest conventions
- **FR-037**: Tests SHOULD use TypeScript for type safety and consistency with implementation code

### Documentation Requirements (User Story 5)

- **FR-038**: System MUST include Mermaid.js sequence diagrams in `docs/` directory for all 7 public API functions
- **FR-039**: Each sequence diagram file MUST start with `` ```mermaid`` on line 1 and end with `` ``` `` on the last line (before EOF newline)
- **FR-040**: Sequence diagrams MUST show complete execution flow through all layers: API → Application → Domain → Infrastructure
- **FR-041**: Sequence diagrams MUST include participant declarations for all major components (RateLimiter, HttpClient, Repository, Service, Value Objects, Domain Entities)
- **FR-042**: Sequence diagrams MUST show both happy path (successful data retrieval) and error paths (ValidationError, NetworkError, ParsingError) where relevant
- **FR-043**: System MUST include architecture overview diagrams showing bounded contexts and layer dependencies
- **FR-044**: System MUST include dedicated sequence diagram for error handling patterns across all layers
- **FR-045**: System MUST include dedicated sequence diagram for rate limiting and retry logic
- **FR-046**: All diagrams MUST use proper Mermaid sequenceDiagram syntax compatible with GitHub and VS Code Markdown renderers
- **FR-047**: Diagrams SHOULD include notes explaining DDD patterns (Aggregate creation, Value Object validation, Anti-Corruption Layer)

### Assumptions

- The LoLalytics website HTML structure will remain reasonably stable during and after migration
- This is a complete rewrite in TypeScript/Node.js - no backward compatibility with Python API required
- The library will be distributed via npm package registry
- Default rank filtering to "Emerald+" (when rank parameter is empty) aligns with typical user needs for high-level play statistics
- All functions will use async/await patterns (returning Promises) for modern asynchronous handling
- Type definitions will be provided via TypeScript, eliminating need for separate @types package
- All naming conventions will follow TypeScript/JavaScript standards (camelCase for functions/variables, PascalCase for classes/types)
- Domain-Driven Design will be applied to organize code around business concepts (Champion statistics, Meta analysis, Matchup data)
- Rate limiting of 10 requests/second is sufficient for typical use cases while protecting LoLalytics infrastructure
- No response caching ensures data freshness and reduces complexity; rate limiting provides sufficient protection against excessive requests
- Optional logging provides debugging capabilities without forcing a specific logging framework; defaults to silent to avoid cluttering user applications
- Delegating champion name validation to LoLalytics avoids maintaining a champion roster and gracefully handles new champions without library updates

### Domain Model (DDD)

This specification follows Domain-Driven Design principles. The domain is organized into bounded contexts with clearly defined aggregates, entities, and value objects.

#### Bounded Contexts

1. **Champion Statistics Context**: Retrieval and representation of individual champion performance data
2. **Tier List Context**: Ranking and comparison of champions across the meta
3. **Matchup Analysis Context**: Head-to-head champion performance and counter relationships
4. **Meta Tracking Context**: Patch-based changes and trends in champion viability

#### Aggregates & Entities

- **Champion** (Entity): Core domain object with identity. Properties: name (unique identifier), role/lane
- **ChampionStatistics** (Aggregate Root): Contains all performance metrics for a champion. Aggregates: winrate, pickrate, banrate, tier rating, rank position, games played, lane-specific data. Invariant: All statistics must reference a valid champion
- **TierListEntry** (Entity within TierList Aggregate): Represents a champion's position in meta rankings. Properties: champion reference, tier classification, overall winrate, rank position
- **MatchupResult** (Aggregate Root): Represents performance between two champions. Properties: champion1, champion2, winrate (from champion1's perspective), total games. Invariant: champion1 and champion2 must be different
- **PatchChange** (Aggregate Root): Represents balance changes affecting a champion. Properties: champion reference, change category (buff/nerf/adjusted), performance deltas (winrate change, pickrate change, banrate change)

#### Value Objects

- **Winrate**: Immutable percentage value (0-100%). Encapsulates winrate logic
- **Pickrate**: Immutable percentage value representing pick frequency
- **Banrate**: Immutable percentage value representing ban frequency
- **TierRating**: Immutable classification (S+, S, A, B, C, D, F) based on performance thresholds
- **RankFilter**: Immutable filter specification (e.g., "emerald", "grandmaster_plus") with validation
- **LaneFilter**: Immutable lane specification (e.g., "middle", "jungle") with validation
- **PerformanceDelta**: Immutable change measurement with direction and magnitude

#### Domain Services

- **TierCalculationService**: Determines tier rating from performance metrics (not naturally part of ChampionStatistics)
- **MatchupAnalysisService**: Computes counter effectiveness and matchup favorability
- **MetaTrendService**: Analyzes patch-to-patch changes and identifies meta shifts

#### Repositories (Domain Interface)

- **ChampionRepository**: Fetches and reconstructs Champion and ChampionStatistics aggregates from LoLalytics HTML
- **TierListRepository**: Fetches and reconstructs TierList aggregate containing ranked champions
- **MatchupRepository**: Fetches and reconstructs MatchupResult aggregates for champion pairs
- **PatchNotesRepository**: Fetches and reconstructs PatchChange aggregates categorized by change type

#### Ubiquitous Language

Use these domain terms consistently in code, documentation, and user communication:
- **Champion**: A playable character in League of Legends
- **Tier List**: Meta ranking of champions by overall effectiveness
- **Matchup**: Head-to-head performance between two champions
- **Counter**: A champion that performs well against another specific champion
- **Patch Notes**: Balance changes affecting champion viability
- **Buff/Nerf/Adjusted**: Categories of champion balance changes
- **Rank**: Player skill tier (e.g., Bronze, Silver, Gold, Platinum, Diamond, Master, Grandmaster, Challenger)
- **Lane/Role**: Position on the map (Top, Jungle, Middle, Bottom, Support)
- **Winrate**: Percentage of games won with a champion
- **Pickrate**: Frequency of champion selection
- **Banrate**: Frequency of champion being banned

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 7 core functions have TypeScript implementations following modern async/await patterns with proper type definitions
- **SC-002**: Users can retrieve tier list data for any combination of rank and lane filters in under 3 seconds under normal network conditions
- **SC-003**: The library successfully handles at least 95% of HTML parsing cases without errors when LoLalytics structure remains stable
- **SC-004**: All input validation errors provide clear, actionable error messages that guide users to correct usage
- **SC-005**: The package includes complete TypeScript type definitions for all public functions and return types
- **SC-006**: Developer documentation includes usage examples for all 7 main functions with TypeScript-idiomatic code
- **SC-007**: Package is installable via npm and functions are importable in both CommonJS and ES Module environments
- **SC-008**: All public functions use TypeScript naming conventions (camelCase) and return properly typed Promise-based results

### TypeScript Quality Indicators

- **SC-009**: All return types use TypeScript interfaces/types rather than plain JSON objects
- **SC-010**: Error handling uses typed custom error classes (ValidationError, NetworkError, ParsingError) with proper error context

### DDD Compliance

- **SC-011**: Code structure reflects bounded contexts with clear module/directory boundaries for each context
- **SC-012**: All domain concepts use ubiquitous language terms consistently across code, types, and documentation
- **SC-013**: Domain logic is separated from infrastructure code (repositories handle HTML parsing, domain models contain business rules)
- **SC-014**: Value objects are immutable and self-validating (e.g., Winrate rejects values outside 0-100 range)
- **SC-015**: Aggregates enforce their invariants (e.g., MatchupResult ensures champion1 != champion2)

### Testing Quality (User Story 4)

- **SC-016**: Jest test suite covers all 7 public API functions with passing tests
- **SC-017**: All validation tests verify errors are thrown BEFORE network requests (no actual HTTP calls for validation failures)
- **SC-018**: Tests validate complete data structures returned from each function match their TypeScript DTO interfaces
- **SC-019**: Tests verify all lane and rank shortcuts are correctly handled
- **SC-020**: Tests verify all error types (ValidationError, NetworkError, ParsingError) include appropriate context fields
- **SC-021**: Test suite can be executed with `npm test` and provides clear pass/fail feedback

### Documentation Quality (User Story 5)

- **SC-022**: Mermaid.js sequence diagrams exist for all 7 public API functions in `docs/` directory
- **SC-023**: All sequence diagram files follow the required format (start with `` ```mermaid``, end with `` ``` ``)
- **SC-024**: All diagrams render correctly in GitHub and VS Code Markdown viewers
- **SC-025**: Sequence diagrams accurately reflect the actual code execution paths through all DDD layers
- **SC-026**: Diagrams include clear participant names matching actual class/module names in the codebase
- **SC-027**: Architecture overview diagrams clearly show bounded context boundaries and layer dependencies
- **SC-028**: Error handling diagrams show validation, network, and parsing error paths
- **SC-029**: Rate limiting diagram shows Bottleneck integration, retry logic, and timeout enforcement
