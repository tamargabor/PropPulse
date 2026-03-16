# ADR 011: Routing Strategy (Skipping TanStack Router)

## Date
2026-03-14

## Status
Rejected / Postponed

## Context
While implementing client-side routing (see ADR 008), we evaluated **TanStack Router** as a modern alternative to `react-router-dom`. TanStack Router offers 100% type-safe routing, file-based route generation, and strict validation for search parameters, which perfectly aligns with our TypeScript-first approach.

## Decision
We decided to **skip/postpone** the adoption of TanStack Router and proceed with `react-router-dom` for the MVP (Minimum Viable Product) phase.

## Consequences
* **Positive:** We avoided the initial setup complexity and steeper learning curve associated with TanStack Router. We were able to implement the routing architecture rapidly using industry-standard, familiar patterns.
* **Negative:** We lack compile-time validation for our `<Link to="...">` paths. If a route string is typoed, it will only be caught at runtime (resulting in a 404). 
* **Future mitigation:** If the application scales to dozens of complex routes and search parameters, migrating from `react-router-dom` to TanStack Router should be re-evaluated.