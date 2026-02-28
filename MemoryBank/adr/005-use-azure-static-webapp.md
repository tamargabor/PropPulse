# ADR 006: Serverless Hosting Strategy with Azure Static Web Apps

## Status
Accepted

## Context
For the PropPulse Proof of Concept (PoC), we need a hosting strategy for both the frontend portal and the backend API. The primary business driver is **maximum cost-efficiency**. The expected maximum concurrent load is very low (around 5 simultaneous users). Initially, a standard ASP.NET Core Web API was considered, but the fixed monthly costs of an Azure App Service are unnecessary for this phase.

## Decision
We will adopt a completely serverless architecture using **Azure Static Web Apps (SWA)**.
- **Frontend:** Hosted as static assets via SWA's global CDN.
- **Backend (API):** Hosted as **Azure Functions** (managed backend of SWA).
- **Authentication:** We will utilize SWA's built-in authentication routing (`/.auth/login/aad`) to integrate with Azure Entra ID, significantly reducing custom security code.

## Rationale
- **Cost:** The SWA Free/Standard tier combined with consumption-based Azure Functions provides a near-zero cost environment.
- **Traffic Profile:** With a maximum of 5 concurrent users, the typical serverless drawback of SQL Server connection pool exhaustion is highly improbable.
- **Simplicity:** Integrated CI/CD via GitHub Actions for both frontend and backend in a single workflow.

## Consequences & Mitigation
1. **Refactoring:** The existing `PropPulse.Api` (ASP.NET Core Web API) project must be deleted and replaced with a `PropPulse.Functions` project.
2. **Cold Starts:** The first user accessing the portal after an idle period may experience a 3-8 second delay. Acceptable for a PoC.
3. **Database Connections:** We must explicitly limit the connection pool size in our EF Core configuration (e.g., `Max Pool Size=10;` in the connection string) and ensure short-lived `DbContext` lifecycles to protect the underlying Azure SQL Database.