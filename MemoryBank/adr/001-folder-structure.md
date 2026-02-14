# ADR 001: Repository Structure and Documentation Management

## Context
We need a clear separation between infrastructure, documentation, and application code. The developer needs a dedicated location to read the project's state and history.

## Decision
1. **MemoryBank:** All Markdown documentation, including ADRs (Architecture Decision Records) and Stages, will be stored here.
2. **Infra:** Contains Bicep files, SQL schema scripts, as database state is considered part of the infrastructure, and other infrastructure-related files.
3. **Src:** Reserved strictly for executable application code.

## Rationale
- Improves maintainability and discoverability.
- Simplifies the context-setting. We can point the simply point to the `MemoryBank` folder.
- Separation of concerns between "what it is" (docs/infra) and "how it works" (src).