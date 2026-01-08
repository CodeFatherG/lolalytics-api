# Tasks: TypeScript Refactor

**Input**: Design documents from `/specs/001-typescript-refactor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are OPTIONAL per constitution Principle V. This task list does NOT include test tasks unless explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow DDD layered architecture from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize TypeScript project with package.json and tsconfig.json targeting ES2022
- [X] T002 [P] Install core dependencies: cheerio@1.0+, undici@5.0+, bottleneck@2.19+, pino@8.0+
- [X] T003 [P] Install dev dependencies: Jest@29+, ts-jest, @types/node, TypeScript@5.3+
- [X] T004 [P] Configure Jest with ts-jest for TypeScript testing in jest.config.js
- [X] T005 [P] Configure tsconfig.json for dual CommonJS/ESM output with declaration files
- [X] T006 Create directory structure per DDD architecture (domain/, infrastructure/, application/, api/, config/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Shared Kernel (Common Value Objects & Errors)

- [X] T007 [P] Create RankFilter value object in src/domain/shared/value-objects/RankFilter.ts with validation and shortcut mapping
- [X] T008 [P] Create LaneFilter value object in src/domain/shared/value-objects/LaneFilter.ts with validation and shortcut mapping
- [X] T009 [P] Create ValidationError in src/domain/shared/errors/ValidationError.ts
- [X] T010 [P] Create NetworkError in src/domain/shared/errors/NetworkError.ts with retry context
- [X] T011 [P] Create ParsingError in src/domain/shared/errors/ParsingError.ts with selector context

### Infrastructure Layer (HTTP, Logging, Parsing)

- [X] T012 [P] Create Logger interface in src/infrastructure/logging/Logger.ts
- [X] T013 Create PinoLogger implementation in src/infrastructure/logging/PinoLogger.ts with silent default
- [X] T014 Create RetryStrategy in src/infrastructure/http/RetryStrategy.ts with exponential backoff (1s, 2s)
- [X] T015 Create RateLimiter in src/infrastructure/http/RateLimiter.ts using Bottleneck (10 req/s)
- [X] T016 Create HttpClient in src/infrastructure/http/HttpClient.ts using undici with 5s timeout, retry, and rate limiting
- [X] T017 [P] Create CheerioParser utility in src/infrastructure/parsing/CheerioParser.ts
- [X] T018 [P] Create SelectorStrategies helper in src/infrastructure/parsing/SelectorStrategies.ts

### Configuration

- [X] T019 [P] Create configuration types in src/config/types.ts for HTTP, logging, rate limiting
- [X] T020 [P] Create default configuration in src/config/defaults.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core Data Retrieval Functions (Priority: P1) 🎯 MVP

**Goal**: Implement getTierlist(), getChampionData(), getCounters(), and matchup() functions with full DDD architecture

**Independent Test**: Import library, call getTierlist(10, 'mid', 'emerald'), verify JSON with 10 champions containing rank, champion, tier, winrate fields

### Champion Statistics Context (Bounded Context 1)

#### Domain Layer - Champion Statistics

- [X] T021 [P] [US1] Create Champion entity in src/domain/champion-statistics/entities/Champion.ts
- [X] T022 [P] [US1] Create Winrate value object in src/domain/champion-statistics/value-objects/Winrate.ts (0-100% validation)
- [X] T023 [P] [US1] Create Pickrate value object in src/domain/champion-statistics/value-objects/Pickrate.ts
- [X] T024 [P] [US1] Create Banrate value object in src/domain/champion-statistics/value-objects/Banrate.ts
- [X] T025 [P] [US1] Create TierRating value object in src/domain/champion-statistics/value-objects/TierRating.ts (S+, S, A, B, C, D, F)
- [X] T026 [US1] Create ChampionStatistics aggregate root in src/domain/champion-statistics/entities/ChampionStatistics.ts
- [X] T027 [US1] Create TierCalculationService in src/domain/champion-statistics/services/TierCalculationService.ts
- [X] T028 [US1] Create ChampionRepository interface in src/domain/champion-statistics/repositories/ChampionRepository.ts

#### Infrastructure Layer - Champion Statistics

- [X] T029 [US1] Implement LoLalyticsChampionRepository in src/infrastructure/repositories/LoLalyticsChampionRepository.ts with HTML parsing

#### Application Layer - Champion Statistics

- [X] T030 [US1] Create ChampionStatsDTO in src/application/dto/ChampionStatsDTO.ts for JSON serialization
- [X] T031 [US1] Create ChampionStatisticsService in src/application/services/ChampionStatisticsService.ts

#### API Layer - Champion Statistics

- [X] T032 [US1] Implement getChampionData function in src/api/getChampionData.ts
- [X] T033 [US1] Add input validation for empty champion name in getChampionData

### Tier List Context (Bounded Context 2)

#### Domain Layer - Tier List

- [X] T034 [P] [US1] Create TierListEntry entity in src/domain/tier-list/entities/TierListEntry.ts
- [X] T035 [US1] Create TierList aggregate root in src/domain/tier-list/entities/TierList.ts
- [X] T036 [US1] Create TierComparisonService in src/domain/tier-list/services/TierComparisonService.ts
- [X] T037 [US1] Create TierListRepository interface in src/domain/tier-list/repositories/TierListRepository.ts

#### Infrastructure Layer - Tier List

- [X] T038 [US1] Implement LoLalyticsTierListRepository in src/infrastructure/repositories/LoLalyticsTierListRepository.ts with tier list page parsing

#### Application Layer - Tier List

- [X] T039 [US1] Create TierListDTO in src/application/dto/TierListDTO.ts
- [X] T040 [US1] Create TierListService in src/application/services/TierListService.ts

#### API Layer - Tier List

- [X] T041 [US1] Implement getTierlist function in src/api/getTierlist.ts
- [X] T042 [US1] Implement getCounters function in src/api/getCounters.ts
- [X] T043 [US1] Add input validation for empty champion name in getCounters

### Matchup Analysis Context (Bounded Context 3)

#### Domain Layer - Matchup Analysis

- [X] T044 [P] [US1] Create CounterEffectiveness value object in src/domain/matchup-analysis/value-objects/CounterEffectiveness.ts
- [X] T045 [US1] Create MatchupResult aggregate root in src/domain/matchup-analysis/entities/MatchupResult.ts with champion1 != champion2 invariant
- [X] T046 [US1] Create MatchupAnalysisService in src/domain/matchup-analysis/services/MatchupAnalysisService.ts
- [X] T047 [US1] Create MatchupRepository interface in src/domain/matchup-analysis/repositories/MatchupRepository.ts

#### Infrastructure Layer - Matchup Analysis

- [X] T048 [US1] Implement LoLalyticsMatchupRepository in src/infrastructure/repositories/LoLalyticsMatchupRepository.ts with matchup page parsing

#### Application Layer - Matchup Analysis

- [X] T049 [US1] Create MatchupDTO in src/application/dto/MatchupDTO.ts
- [X] T050 [US1] Create MatchupAnalysisService in src/application/services/MatchupAnalysisService.ts

#### API Layer - Matchup Analysis

- [X] T051 [US1] Implement matchup function in src/api/matchup.ts
- [X] T052 [US1] Add input validation for empty champion names and champion1 != champion2 in matchup

### Main API Export

- [X] T053 [US1] Create main API entry point in src/api/index.ts exporting getTierlist, getChampionData, getCounters, matchup

**Checkpoint**: At this point, User Story 1 should be fully functional - all 4 core data retrieval functions working with full DDD architecture

---

## Phase 4: User Story 2 - Configuration & Utility Functions (Priority: P2)

**Goal**: Implement displayRanks() and displayLanes() helper functions

**Independent Test**: Call displayRanks() and verify complete mapping returned (e.g., 'gm+' → 'grandmaster_plus'); call displayLanes() and verify mapping (e.g., 'jg' → 'jungle')

### API Layer - Utility Functions

- [X] T054 [P] [US2] Implement displayRanks function in src/api/displayRanks.ts returning rank mappings from RankFilter
- [X] T055 [P] [US2] Implement displayLanes function in src/api/displayLanes.ts returning lane mappings from LaneFilter
- [X] T056 [US2] Update main API entry point in src/api/index.ts to export displayRanks and displayLanes

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - developers can discover valid rank/lane values without documentation

---

## Phase 5: User Story 3 - Patch Notes & Meta Changes (Priority: P3)

**Goal**: Implement patchNotes() function for tracking champion balance changes

**Independent Test**: Call patchNotes('all') and verify JSON with three categories (buffed, nerfed, adjusted) containing champions with winrate/pickrate/banrate deltas

### Meta Tracking Context (Bounded Context 4)

#### Domain Layer - Meta Tracking

- [X] T057 [P] [US3] Create PerformanceDelta value object in src/domain/meta-tracking/value-objects/PerformanceDelta.ts
- [X] T058 [P] [US3] Create ChangeCategory value object in src/domain/meta-tracking/value-objects/ChangeCategory.ts (buffed/nerfed/adjusted)
- [X] T059 [US3] Create PatchChange aggregate root in src/domain/meta-tracking/entities/PatchChange.ts
- [X] T060 [US3] Create MetaTrendService in src/domain/meta-tracking/services/MetaTrendService.ts
- [X] T061 [US3] Create PatchNotesRepository interface in src/domain/meta-tracking/repositories/PatchNotesRepository.ts

#### Infrastructure Layer - Meta Tracking

- [X] T062 [US3] Implement LoLalyticsPatchNotesRepository in src/infrastructure/repositories/LoLalyticsPatchNotesRepository.ts with patch notes page parsing

#### Application Layer - Meta Tracking

- [X] T063 [US3] Create PatchNotesDTO in src/application/dto/PatchNotesDTO.ts
- [X] T064 [US3] Create MetaTrackingService in src/application/services/MetaTrackingService.ts

#### API Layer - Meta Tracking

- [X] T065 [US3] Implement patchNotes function in src/api/patchNotes.ts supporting 'all', 'buffed', 'nerfed', 'adjusted' categories
- [X] T066 [US3] Add input validation for category parameter in patchNotes
- [X] T067 [US3] Update main API entry point in src/api/index.ts to export patchNotes

**Checkpoint**: All user stories should now be independently functional - complete library with tier lists, champion data, counters, matchups, utility functions, and patch notes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T068 [P] Add comprehensive JSDoc comments to all public API functions in src/api/
- [ ] T069 [P] Create package.json with proper exports for CommonJS and ESM
- [ ] T070 [P] Create README.md with installation instructions and TypeScript usage examples for all 7 functions
- [ ] T071 [P] Verify all return types use TypeScript interfaces (not plain objects or JSON.stringify)
- [ ] T072 Verify all error messages include context (URL, parameters, retry attempts)
- [ ] T073 Verify all value objects are immutable and self-validating
- [ ] T074 Verify all aggregates enforce their invariants
- [ ] T075 Run smoke test against live LoLalytics to verify HTML parsing still works
- [ ] T076 [P] Generate TypeScript declaration files (.d.ts) for all public APIs
- [ ] T077 [P] Add .npmignore to exclude specs/, tests/, and development files from npm package

---

## Phase 7: User Story 4 - Comprehensive Testing Suite (Priority: P4)

**Goal**: Replicate Python test coverage in Jest with TypeScript-idiomatic patterns

**Independent Test**: Run `npm test` and verify all tests pass with coverage of all 7 API functions, validation logic, error handling, and data structure compliance

### Integration Tests - getTierlist

- [ ] T078 [P] [US4] Create tests/integration/api/getTierlist.test.ts with test suite structure
- [ ] T079 [US4] Add test verifying getTierlist(1, 'mid', 'emerald') returns TierListDTO with correct structure
- [ ] T080 [US4] Add test verifying invalid lane throws ValidationError before network request
- [ ] T081 [US4] Add test verifying invalid rank throws ValidationError before network request
- [ ] T082 [US4] Add tests for all valid lane shortcuts ('top', 'jg', 'jungle', 'mid', 'middle', 'bot', 'bottom', 'adc', 'support', 'sup')
- [ ] T083 [US4] Add test verifying returned data has rank, championName, tier, winrate fields matching TierListEntryDTO

### Integration Tests - getChampionData

- [ ] T084 [P] [US4] Create tests/integration/api/getChampionData.test.ts with test suite structure
- [ ] T085 [US4] Add test verifying getChampionData('jax', 'top', 'd+') returns ChampionStatsDTO with all fields
- [ ] T086 [US4] Add test verifying empty champion name throws ValidationError before network request
- [ ] T087 [US4] Add test verifying returned data has winrate, pickrate, banrate, tier, rank, gamesPlayed fields
- [ ] T088 [US4] Add test verifying rank and lane shortcuts are correctly translated

### Integration Tests - getCounters

- [ ] T089 [P] [US4] Create tests/integration/api/getCounters.test.ts with test suite structure
- [ ] T090 [US4] Add test verifying getCounters(1, 'yasuo') returns array of CounterDTO objects
- [ ] T091 [US4] Add test verifying empty champion name throws ValidationError before network request
- [ ] T092 [US4] Add test verifying returned counters have championName and winrate fields

### Integration Tests - matchup

- [ ] T093 [P] [US4] Create tests/integration/api/matchup.test.ts with test suite structure
- [ ] T094 [US4] Add test verifying matchup('jax', 'vayne', 'top', 'master') returns MatchupDTO with correct structure
- [ ] T095 [US4] Add test verifying empty champion names throw ValidationError before network request
- [ ] T096 [US4] Add test verifying returned data has champion1, champion2, winrate, totalGames fields

### Integration Tests - patchNotes

- [ ] T097 [P] [US4] Create tests/integration/api/patchNotes.test.ts with test suite structure
- [ ] T098 [US4] Add test verifying patchNotes('all', 'g+') returns PatchNotesDTO with buffed, nerfed, adjusted arrays
- [ ] T099 [US4] Add test verifying patchNotes('buffed') filters correctly to only buffed champions
- [ ] T100 [US4] Add test verifying patchNotes('nerfed') filters correctly to only nerfed champions
- [ ] T101 [US4] Add test verifying patchNotes('adjusted') filters correctly to only adjusted champions
- [ ] T102 [US4] Add test verifying invalid category throws ValidationError before network request

### Integration Tests - Utility Functions

- [ ] T103 [P] [US4] Create tests/integration/api/displayUtilities.test.ts with test suite structure
- [ ] T104 [US4] Add test verifying displayRanks() returns complete mapping object
- [ ] T105 [US4] Add test verifying displayLanes() returns complete mapping object
- [ ] T106 [US4] Add test verifying specific shortcuts map correctly ('gm+' → 'grandmaster_plus', 'jg' → 'jungle')

### Validation & Error Tests

- [ ] T107 [P] [US4] Create tests/integration/api/validation.test.ts for centralized validation tests
- [ ] T108 [US4] Add tests verifying all invalid lane values throw ValidationError with helpful message
- [ ] T109 [US4] Add tests verifying all invalid rank values throw ValidationError with helpful message
- [ ] T110 [US4] Add tests verifying empty champion names throw ValidationError with parameter context

### Error Context Tests

- [ ] T111 [P] [US4] Create tests/integration/api/errors.test.ts for error context verification
- [ ] T112 [US4] Add test verifying ValidationError includes parameterName and invalidValue fields
- [ ] T113 [US4] Add test verifying ValidationError extends Error properly
- [ ] T114 [US4] Add test verifying error messages are descriptive and actionable

### Unit Tests - Domain Layer (Optional but Recommended)

- [ ] T115 [P] [US4] Create tests/unit/domain/value-objects/Winrate.test.ts
- [ ] T116 [US4] Add tests verifying Winrate rejects values outside 0-100% range
- [ ] T117 [US4] Add tests verifying Winrate.fromString() parses "52.5%" correctly
- [ ] T118 [P] [US4] Create tests/unit/domain/value-objects/TierRating.test.ts
- [ ] T119 [US4] Add tests verifying TierRating validates tier values (S+, S, A, B, C, D, F)
- [ ] T120 [US4] Add tests verifying TierRating.toNumericScore() returns correct values
- [ ] T121 [P] [US4] Create tests/unit/domain/entities/MatchupResult.test.ts
- [ ] T122 [US4] Add test verifying MatchupResult enforces champion1 != champion2 invariant

### Test Infrastructure & Configuration

- [ ] T123 [P] [US4] Verify jest.config.js is properly configured for TypeScript with ts-jest
- [ ] T124 [US4] Add npm test scripts (test, test:watch, test:coverage) to package.json if not present
- [ ] T125 [US4] Create tests/setup.ts for global test configuration and timeout settings
- [ ] T126 [US4] Add .test.ts files to .gitignore patterns if needed

**Checkpoint**: All tests pass with `npm test` - library has comprehensive test coverage replicating Python tests with TypeScript patterns

---

## Phase 8: User Story 5 - Sequence Diagram Documentation (Priority: P5)

**Goal**: Create Mermaid.js sequence diagrams documenting execution flows for all 7 API functions and architectural patterns

**Independent Test**: Open `docs/` directory and verify all diagrams render correctly in VS Code/GitHub, showing complete execution paths through DDD layers

### Setup & Directory Structure

- [ ] T127 [P] [US5] Create docs/ directory at repository root
- [ ] T128 [P] [US5] Create docs/README.md explaining diagram organization and how to view them

### API Function Sequence Diagrams

- [ ] T129 [P] [US5] Create docs/sequence-getTierlist.md with complete execution flow diagram
- [ ] T130 [P] [US5] Create docs/sequence-getChampionData.md with execution flow including validation/network/parsing error paths
- [ ] T131 [P] [US5] Create docs/sequence-getCounters.md with execution flow diagram
- [ ] T132 [P] [US5] Create docs/sequence-matchup.md with execution flow diagram
- [ ] T133 [P] [US5] Create docs/sequence-patchNotes.md with execution flow diagram
- [ ] T134 [P] [US5] Create docs/sequence-displayRanks.md with simple utility flow diagram
- [ ] T135 [P] [US5] Create docs/sequence-displayLanes.md with simple utility flow diagram

### Architecture Overview Diagrams

- [ ] T136 [P] [US5] Create docs/architecture-overview.md showing all 4 bounded contexts and shared kernel
- [ ] T137 [P] [US5] Create docs/architecture-layers.md showing DDD layer dependencies (API → Application → Domain ← Infrastructure)
- [ ] T138 [P] [US5] Create docs/architecture-bounded-contexts.md showing context map with Anti-Corruption Layer

### Cross-Cutting Concern Diagrams

- [ ] T139 [P] [US5] Create docs/sequence-error-handling.md showing ValidationError, NetworkError, ParsingError flows
- [ ] T140 [P] [US5] Create docs/sequence-rate-limiting.md showing RateLimiter, RetryStrategy, timeout enforcement

### Diagram Content Requirements (Per Diagram)

Each API function sequence diagram must include:
- [ ] T141 [US5] Verify all diagrams start with `` ```mermaid`` on line 1 and end with `` ``` `` on last line
- [ ] T142 [US5] Verify all diagrams declare participants matching actual class names (RateLimiter, HttpClient, Repository, Service, etc.)
- [ ] T143 [US5] Verify all diagrams show complete happy path from user call to DTO return
- [ ] T144 [US5] Verify all diagrams show validation step with value object creation (LaneFilter, RankFilter)
- [ ] T145 [US5] Verify all diagrams show HTTP request flow with rate limiting
- [ ] T146 [US5] Verify all diagrams show HTML parsing and domain entity construction
- [ ] T147 [US5] Verify all diagrams show DTO conversion and response return
- [ ] T148 [US5] Verify getChampionData diagram includes error paths for ValidationError, NetworkError, ParsingError
- [ ] T149 [US5] Add notes explaining DDD patterns (Value Object validation, Aggregate creation, Anti-Corruption Layer)

### Diagram Quality Verification

- [ ] T150 [US5] Test all diagrams render correctly in VS Code Markdown preview
- [ ] T151 [US5] Test all diagrams render correctly when viewed on GitHub (push to branch and verify)
- [ ] T152 [US5] Verify all participant names match actual class/module names in codebase
- [ ] T153 [US5] Verify all arrow directions correctly show call/return flow
- [ ] T154 [US5] Verify error paths use correct Mermaid syntax (alt/else blocks, -x arrows)
- [ ] T155 [US5] Add sequence numbers to complex diagrams for clarity where needed

### Documentation Index

- [ ] T156 [US5] Update docs/README.md with links to all sequence diagrams organized by category
- [ ] T157 [US5] Add section in docs/README.md explaining how to read sequence diagrams
- [ ] T158 [US5] Add section in docs/README.md explaining DDD layers shown in diagrams
- [ ] T159 [US5] Update root README.md to link to docs/ directory for architecture documentation

**Checkpoint**: All Mermaid diagrams render correctly and accurately document code execution paths through all DDD layers

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete
- **Testing (Phase 7)**: Depends on all user stories (Phase 3-5) being complete - Tests the implemented functionality
- **Documentation (Phase 8)**: Can start after implementation complete (Phase 3-6) - Documents actual code execution paths

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (reads from RankFilter/LaneFilter already created in Phase 2)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P4)**: Can start after User Stories 1-3 are complete - Tests the implemented API functions
- **User Story 5 (P5)**: Can start after implementation (Phase 3-6) is complete - Documents actual execution paths through code

### Within Each User Story

All user stories follow DDD layered dependency order:
1. **Domain Layer** (value objects, entities, aggregates, services, repository interfaces)
2. **Infrastructure Layer** (repository implementations with HTML parsing)
3. **Application Layer** (DTOs, application services)
4. **API Layer** (public functions)

Within domain layer:
- Value objects first (no dependencies)
- Entities using value objects second
- Aggregates using entities third
- Services and repository interfaces last

### Parallel Opportunities

- **Phase 1 Setup**: T002, T003, T004, T005 can all run in parallel
- **Phase 2 Foundational**:
  - Shared Kernel: T007, T008, T009, T010, T011 can run in parallel
  - Infrastructure: T012, T017, T018, T019, T020 can run in parallel
- **Phase 3 User Story 1**:
  - Value objects within each context can run in parallel (T022-T025, T044)
  - Entities within same context (T021, T034) can run in parallel
- **Phase 4 User Story 2**: T054, T055 can run in parallel
- **Phase 5 User Story 3**: T057, T058 can run in parallel
- **Phase 6 Polish**: T068, T069, T070, T071, T076, T077 can run in parallel
- **Phase 7 Testing**: Many test file creation tasks can run in parallel:
  - T078, T084, T089, T093, T097, T103, T107, T111 (test file creation)
  - T115, T118, T121 (unit test file creation)
  - T123, T124, T125, T126 (test infrastructure)
- **Phase 8 Documentation**: Most diagram creation tasks can run in parallel:
  - T127, T128 (setup)
  - T129-T135 (all 7 API function diagrams)
  - T136-T138 (all 3 architecture diagrams)
  - T139, T140 (cross-cutting concern diagrams)

Once Foundational phase completes:
- **All three user stories can start in parallel** (if team capacity allows)

Once User Stories 1-3 complete:
- **Testing phase can begin** - many test files can be created in parallel
- **Documentation phase can begin** - all diagrams can be created in parallel (trace actual code paths)

---

## Parallel Example: User Story 1 - Champion Statistics Value Objects

```bash
# Launch all value objects for Champion Statistics context together:
Task: "Create Winrate value object in src/domain/champion-statistics/value-objects/Winrate.ts"
Task: "Create Pickrate value object in src/domain/champion-statistics/value-objects/Pickrate.ts"
Task: "Create Banrate value object in src/domain/champion-statistics/value-objects/Banrate.ts"
Task: "Create TierRating value object in src/domain/champion-statistics/value-objects/TierRating.ts"
```

---

## Parallel Example: All User Stories After Foundational

```bash
# Once Phase 2 is complete, launch all three user stories in parallel:

# Developer A works on User Story 1 (Phase 3):
Task: "Create Champion entity in src/domain/champion-statistics/entities/Champion.ts"
Task: "Create Winrate value object in src/domain/champion-statistics/value-objects/Winrate.ts"
# ... continue with all US1 tasks

# Developer B works on User Story 2 (Phase 4):
Task: "Implement displayRanks function in src/api/displayRanks.ts"
Task: "Implement displayLanes function in src/api/displayLanes.ts"

# Developer C works on User Story 3 (Phase 5):
Task: "Create PerformanceDelta value object in src/domain/meta-tracking/value-objects/PerformanceDelta.ts"
Task: "Create ChangeCategory value object in src/domain/meta-tracking/value-objects/ChangeCategory.ts"
# ... continue with all US3 tasks
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Core Data Retrieval)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Test getTierlist(10, 'mid', 'emerald')
   - Test getChampionData('ahri', 'mid', 'emerald')
   - Test getCounters(5, 'yasuo', 'diamond')
   - Test matchup('zed', 'yasuo', 'mid')
5. Deploy/publish MVP to npm if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP with 4 core functions!)
3. Add User Story 2 → Test independently → Deploy/Demo (MVP + utility functions)
4. Add User Story 3 → Test independently → Deploy/Demo (Complete library with patch notes)
5. Add User Story 4 → Run full test suite → Validate (Comprehensive test coverage)
6. Add User Story 5 → Generate diagrams → Document (Visual architecture documentation)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (Phase 1-2)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Champion Statistics, Tier List, Matchup Analysis contexts)
   - **Developer B**: User Story 2 (Utility functions - quick win!)
   - **Developer C**: User Story 3 (Meta Tracking context)
3. Stories complete and integrate independently
4. **Developer A**: Phase 6 (Polish) - Documentation and final touches
5. Once implementation complete:
   - **Developer B**: Phase 7 (Testing) - Create test suites
   - **Developer C**: Phase 8 (Documentation) - Create sequence diagrams
   - Can work in parallel - testing validates, documentation explains

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to parallelize
- **[Story] label**: Maps task to specific user story for traceability (US1, US2, US3)
- **Each user story is independently completable and testable** per spec.md acceptance scenarios
- **DDD architecture**: Domain layer is pure TypeScript with no infrastructure dependencies
- **Repository pattern**: Abstracts HTML parsing behind domain interfaces
- **Value objects**: All immutable and self-validating per constitution Principle IV
- **Error handling**: ValidationError at boundaries, NetworkError with retry context, ParsingError with selector context
- **Logging**: Silent by default (constitution Principle II), opt-in structured logging with pino
- **Rate limiting**: 10 req/s with bottleneck per spec clarifications
- **Retry strategy**: Exponential backoff (1s, 2s) with max 2 retries per spec clarifications
- **No caching**: Always fetch fresh data per spec clarifications
- **TypeScript conventions**: camelCase for functions/variables, PascalCase for classes/types, async/await patterns
- **Return types**: Use TypeScript interfaces and types, not plain JSON objects
- **Modern standards**: ES2022 features, Promise-based async operations, proper error typing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
