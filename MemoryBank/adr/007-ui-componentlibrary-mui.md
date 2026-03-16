# ADR 007: UI Component Library (Material UI)

## Date
2026-03-14

## Status
Accepted

## Context
Building a SaaS admin interface requires a clean, professional, and consistent look. Writing CSS from scratch, handling component states, animations, and accessibility for complex UI elements (like Dialogs, Selects, Data Grids) would be extremely time-consuming and distract from implementing core business logic.

## Decision
We chose **@mui/material (Material UI)**, which implements Google's Material Design system, instead of traditional CSS frameworks (e.g., Bootstrap) or utility-first CSS (e.g., Tailwind CSS).

## Consequences
* **Positive:** We get industry-standard, ready-to-use "building blocks" (Card, Dialog, TextField, AppBar) that are responsive and fully accessible (a11y) out of the box. The resulting UI feels like a professional "application" rather than a standard "website".
* **Negative:** Material UI has a relatively large bundle size. Overriding default styles heavily can sometimes be complex due to its internal CSS-in-JS (Emotion) engine.