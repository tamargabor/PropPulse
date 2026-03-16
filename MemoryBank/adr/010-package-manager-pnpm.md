# ADR 010: Package Manager (pnpm)

## Date
2026-03-14

## Status
Accepted

## Context
The Node.js ecosystem offers several package managers, primarily `npm`, `yarn`, and `pnpm`. For local development and eventual CI/CD pipelines, we need a tool that is fast, disk-space efficient, and enforces strict dependency resolution to avoid "phantom dependencies" (where a package can require a module it hasn't explicitly declared).

## Decision
We adopted **pnpm** as the standard package manager for the frontend project.

## Consequences
* **Positive:** `pnpm` uses a global store and hard links, which drastically reduces disk space usage and speeds up installation times. Its strict `node_modules` architecture prevents phantom dependencies, ensuring that if a dependency is missing in `package.json`, the build will rightfully fail.
* **Negative:** Some legacy tools or poorly configured libraries assume a flat `node_modules` structure (like `npm` uses) and might require workarounds (e.g., `.npmrc` configuration). Developers used to `npm` must remember to use `pnpm add` or `pnpm run`.