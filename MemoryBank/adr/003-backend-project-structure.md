# ADR 005: Backend Project Organization

## Context
We need a scalable and understandable project structure for the PropPulse .NET solution.

## Decision
The solution will be organized into four distinct projects:
1. **PropPulse.Api**: Controllers, Middleware, and Auth configuration.
2. **PropPulse.Application**: Business logic, services, and orchestration.
3. **PropPulse.Database**: DBContext, Migrations, and SQL specific logic.
4. **PropPulse.Models**: Shared POCO entities (Property, User, Tenant, Lease, Overhead).

## Rationale
- Clear separation of concerns.
- **Models** as a shared project prevents circular dependencies.
- **Application** logic is decoupled from both the entry point (API) and the storage (Database).