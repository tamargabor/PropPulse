# ADR 009: Server State Management (TanStack React Query)

## Date
2026-03-14

## Status
Accepted

## Context
Traditional data fetching in React (using `useEffect` + `useState` + `fetch`) results in excessive boilerplate code. It often leads to over-fetching when components re-render, and makes handling loading/error states cumbersome. We needed a clean way to separate Client State (UI controls) from Server State (the cached copy of our database).

## Decision
We introduced **@tanstack/react-query** to manage network requests (Queries) and data modifications (Mutations). Raw API calls were extracted into a dedicated service layer (`api/propertiesApi.ts`).

## Consequences
* **Positive:** Component complexity is drastically reduced. We gain built-in caching, automatic retries on failure, request deduplication, and background refetching on window focus. Cache invalidation after mutations ensures the UI automatically and consistently reflects the latest server data.
* **Negative:** Introduces a new external dependency and a paradigm shift. Developers must understand how the global `QueryClient` operates and properly manage `queryKey` arrays.