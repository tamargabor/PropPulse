# ADR 008: Client-Side Routing (React Router DOM)

## Date
2026-03-14

## Status
Accepted

## Context
Because our React application is a Single Page Application (SPA), the entire app fundamentally consists of a single HTML file. Despite this, we must provide bookmarkable URLs, support the browser's native "Back" button, and enable logical navigation between different views (Dashboard, Properties, Tenants).

## Decision
We implemented **react-router-dom** to handle client-side routing. *(Note: We considered TanStack Router for its type safety, but opted for the simpler standard solution given the current size and complexity of the project).*

## Consequences
* **Positive:** Full-page reloads are eliminated, making the application navigate with the speed of a native desktop app. URLs remain shareable and deep-linkable.
* **Negative:** We lose server-side routing. When deploying the application, the web host must be explicitly configured to redirect all 404 requests back to `index.html`. Furthermore, we do not have strict compile-time type safety for our route strings.