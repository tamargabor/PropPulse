# ADR 003: Cloud Provider and Hosting Stack

## Status
Accepted

## Context
As we build the PropPulse PoC, we need a unified cloud ecosystem that supports our relational database requirements, identity management, and serverless application hosting. Mixing multiple cloud providers (e.g., AWS for compute, Google for Identity, Azure for SQL) in a PoC phase introduces unnecessary network latency, security complexity, and administrative overhead.

## Decision
We will exclusively use the **Microsoft Azure Cloud Stack** as our foundational infrastructure.

### The Stack Breakdown:
- **Compute / Hosting:** Azure Static Web Apps (Frontend) + Azure Functions (Backend API).
- **Database:** Azure SQL Database (Serverless or Basic tier for PoC cost-efficiency).
- **Identity:** Azure Entra ID (External Identities / B2C).
- **Infrastructure as Code (IaC):** Azure Bicep (located in the `infra/` folder).

## Rationale
- **Synergy:** Native integration between Azure Functions, Entra ID, and Azure SQL via Managed Identities (no hardcoded passwords needed later).
- **Team Expertise:** Aligns perfectly with existing Dynamics 365 / Microsoft ecosystem architectural knowledge.
- **Cost:** Azure offers generous Free tiers for Static Web Apps and Functions, making the PoC operationally cheap.