# ADR 006: Frontend Framework (React + Vite + TypeScript)

## Date
2026-03-14

## Status
Accepted

## Context
The PropPulse SaaS application requires a modern, responsive, and fast admin dashboard. Since our backend (C# Azure Functions) operates as an independent REST API, the frontend needs to run as a standalone client application (SPA - Single Page Application) in the user's browser. We needed to choose the appropriate framework and build tooling.

## Decision
We chose the **React** library, strictly typed with **TypeScript**, and initialized/bundled using **Vite**.

## Consequences
* **Positive:** React has a massive ecosystem, and its component-based architecture makes the codebase highly maintainable. TypeScript provides compile-time type safety, drastically reducing runtime errors. Vite offers a lightning-fast developer experience (HMR - Hot Module Replacement) compared to legacy tools like Webpack.
* **Negative:** For developers coming from a C# and traditional MVC background, React's declarative (state-based) logic and JSX syntax require a steeper learning curve.