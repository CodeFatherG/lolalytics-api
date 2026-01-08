<!--
Sync Impact Report:
Version: 1.1.0 (DDD Principle Added)
Modified Principles:
  - Principle I renamed: "Library-First Architecture" → "Domain-Driven Design & Library-First Architecture"
  - Expanded Principle I with DDD strategic and tactical patterns
Added Sections: None
Removed Sections: None
Templates Status:
  ✅ plan-template.md - Constitution Check section aligned (supports DDD verification)
  ✅ spec-template.md - Requirements structure supports DDD modeling
  ✅ tasks-template.md - Task organization reflects DDD bounded contexts and aggregates
Follow-up TODOs: None
-->

# Lolalytics API Constitution

## Core Principles

### I. Domain-Driven Design & Library-First Architecture

All features must be modeled using Domain-Driven Design principles to align code structure with business domain. This ensures the codebase reflects the problem space and remains maintainable as complexity grows.

**Strategic DDD Patterns**:
- **Ubiquitous Language**: Use domain terminology consistently (e.g., Champion, TierList, Matchup, PatchChange) in code, documentation, and conversations
- **Bounded Contexts**: Clearly separate different domain areas (e.g., Statistics Retrieval, Champion Analysis, Meta Tracking) with explicit boundaries
- **Context Mapping**: Define how bounded contexts interact through well-defined interfaces (e.g., Shared Kernel for common value objects, Anti-Corruption Layer for external services)

**Tactical DDD Patterns**:
- **Entities**: Model domain objects with identity (e.g., Champion has unique name/ID across contexts)
- **Value Objects**: Use immutable objects for domain concepts without identity (e.g., Winrate, TierRating, RankFilter)
- **Aggregates**: Group related entities with a single aggregate root that enforces invariants (e.g., ChampionStatistics aggregate containing winrate, pickrate, banrate)
- **Domain Services**: Encapsulate domain logic that doesn't naturally fit within entities (e.g., MatchupAnalysis, TierCalculation)
- **Repositories**: Abstract data access behind domain-focused interfaces (e.g., ChampionRepository for fetching/parsing champion data)
- **Domain Events**: Represent significant occurrences (e.g., PatchNotesPublished, ChampionDataRefreshed) when needed for complex workflows

**Library-First Requirements**:
- **Self-contained**: Minimal external dependencies; clearly defined boundaries per bounded context
- **Independently testable**: Each bounded context can be tested in isolation without full application context
- **Well-documented**: Public API surface uses ubiquitous language with type hints reflecting domain concepts
- **Purpose-driven**: Each module maps to a clear domain concept or subdomain; no technical-only abstractions

**Rationale**: DDD aligns code with business domain, making it easier to reason about, extend, and maintain. Library-first design ensures modularity and reusability. Together they create a codebase that mirrors how domain experts think about the problem.

### II. Clean Public API

The public API exposed to users must be simple, intuitive, and stable. Requirements:
- **Minimal surface area**: Expose only what users need; internals stay private
- **Consistent signatures**: Similar operations use similar patterns (e.g., all functions accept `rank: str = ''` for rank filtering)
- **Type hints**: All public functions must have complete type annotations
- **Backward compatibility**: Breaking changes require MAJOR version bump

**Rationale**: A clean API reduces cognitive load for users and allows internal refactoring without breaking client code.

### III. Graceful Error Handling

All external interactions (network requests, data parsing) must handle errors gracefully:
- **MUST**: Catch and wrap third-party exceptions with meaningful messages
- **MUST**: Validate inputs at library boundaries; fail fast with clear error messages
- **MUST**: Document error conditions in function docstrings
- **SHOULD**: Provide specific error types for different failure modes (network, parsing, validation)

**Rationale**: Web scraping is inherently fragile. Graceful error handling prevents cryptic failures and helps users diagnose issues quickly.

### IV. Data Validation & Parsing Resilience

HTML structure changes frequently. Parsing logic must be resilient:
- **MUST**: Validate all parsed data before returning to users
- **MUST**: Use explicit selectors with fallback strategies where practical
- **SHOULD**: Log warnings when unexpected HTML structure is encountered (when logging is configured)
- **MUST**: Return consistent data structures even when source data is incomplete

**Rationale**: Lolalytics can change their HTML at any time. Resilient parsing extends the library's useful life and reduces maintenance burden.

### V. Testing (Optional but Recommended)

Testing is optional but strongly encouraged for complex logic:
- **Integration tests**: Recommended for validating against live Lolalytics data (when requested)
- **Contract tests**: Recommended for ensuring API response structure remains stable
- **Unit tests**: Useful for complex parsing/validation logic
- **Test-first**: When tests are written, follow TDD: write tests → verify they fail → implement → verify they pass

**Rationale**: Web scraping changes frequently; tests catch breakage early. However, tests are optional to avoid blocking simple updates.

### VI. Dependency Minimalism

Minimize external dependencies to reduce supply chain risk and installation overhead:
- **MUST**: Justify every new dependency; prefer standard library when sufficient
- **MUST**: Pin major versions; allow minor/patch updates
- **SHOULD**: Prefer widely-adopted, actively-maintained libraries (e.g., `requests`, `lxml`)
- **MUST NOT**: Add dependencies for convenience alone; evaluate alternatives first

**Rationale**: Each dependency is a potential point of failure, security risk, and maintenance burden. Keep the dependency tree small and auditable.

## Development Workflow

### Code Quality Standards

- **Type hints**: Required for all public functions; encouraged for internal functions
- **Docstrings**: Required for all public functions using Google or NumPy style
- **Formatting**: Use `black` for code formatting; use `isort` for import sorting
- **Linting**: Code should pass basic linting (avoid obvious issues); overly strict linting is not required

### Version Increment Rules

Follow semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking API changes (signature changes, removed functions, behavior changes)
- **MINOR**: New features added (new functions, new parameters with defaults, expanded capabilities)
- **PATCH**: Bug fixes, documentation updates, internal refactoring with no API impact

### Release Process

- **Pre-release checklist**: Update version in `pyproject.toml`, update changelog/README if maintained, verify examples still work
- **Testing**: Run test suite if it exists; manually verify core functions against live data
- **Tagging**: Create git tag matching version (e.g., `v0.0.7`)

## Security & Privacy

### Data Handling

- **MUST NOT**: Store or log user credentials or personal data
- **MUST**: Respect Lolalytics' robots.txt and rate limiting if implemented
- **SHOULD**: Implement reasonable request delays to avoid hammering Lolalytics servers
- **MUST**: Clearly document that this is an unofficial scraper; users assume risk

### Dependency Security

- **SHOULD**: Periodically review dependencies for known vulnerabilities
- **MUST**: Update dependencies with critical security fixes promptly
- **SHOULD**: Use `pip-audit` or similar tools to scan for vulnerabilities

## Governance

This constitution supersedes all other practices and guides all development decisions.

### Amendment Process

- **Amendments require**: Clear justification, documentation of impact, update to all dependent templates
- **Version increment**: Constitution follows semantic versioning (MAJOR.MINOR.PATCH)
  - MAJOR: Backward incompatible governance changes (e.g., removing a principle)
  - MINOR: New principles added or existing principles materially expanded
  - PATCH: Clarifications, wording improvements, non-semantic refinements

### Compliance Review

- **All feature specs** must explicitly check compliance with Core Principles
- **All implementation plans** must document any principle violations and justify them
- **All pull requests** should reference which principles the change aligns with

### Complexity Justification

Any violation of Core Principles must be explicitly justified:
- Document the specific need that cannot be met within principles
- Explain why simpler alternatives were rejected
- Obtain user/maintainer approval before proceeding

### Runtime Development Guidance

For agent-specific runtime guidance (e.g., how to invoke commands, tool usage patterns), refer to `.specify/templates/agent-file-template.md` if present, or to command-specific templates in `.specify/templates/commands/*.md`.

**Version**: 1.1.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
