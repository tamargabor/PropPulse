# ADR 002: Database Schema and Identity Mapping

## Status
Accepted

## Context
The application requires a robust relational structure to manage properties, leases, and expenses. Furthermore, we need to bridge the gap between external identity providers (Azure Entra ID/Google) and our internal domain model.

## Decision
We will implement a relational schema using Azure SQL with a decoupled User/Tenant model.

### 1. Data Structure Highlights
- **User vs. Tenant Separation:** Authentication data is stored in `Users`, while profile-specific rental data is in `Tenants`. This allows for multiple roles (Admin, Owner, Tenant) without polluting the core identity.
- **Identity Mapping:** The `Users.ExternalId` column stores the unique identifier (OID/Subject) from Azure Entra ID to link logins to local data.
- **Financial Tracking:** An `Overheads` table is introduced to track utilities, linked to both `Property` (for vacant periods) and `Lease` (for active rentals).

### 2. Schema Evolution
- **Source of Truth:** The DACPAC (SQL Project) in `infra/sql/` is the absolute truth for the schema.
- **Idempotency:** All schema updates must be deployed via state-comparison tools (SqlPackage) to ensure non-destructive updates.

### 3. Core Tables Reference
- `Users`: Identity mapping and RBAC (Roles).
- `Tenants`: Personal details for renters.
- `Properties`: Physical asset information.
- `Leases`: Contractual agreements.
- `Overheads`: Utility and maintenance costs.