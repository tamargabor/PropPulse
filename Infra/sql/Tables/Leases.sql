CREATE TABLE [dbo].[Leases]
(
    [Id]                UNIQUEIDENTIFIER NOT NULL CONSTRAINT [PK_Leases] PRIMARY KEY DEFAULT NEWID(),
    [PropertyId]        UNIQUEIDENTIFIER NOT NULL CONSTRAINT [FK_Leases_Properties] FOREIGN KEY REFERENCES [dbo].[Properties] ([Id]),
    [TenantId]          UNIQUEIDENTIFIER NOT NULL CONSTRAINT [FK_Leases_Tenants]    FOREIGN KEY REFERENCES [dbo].[Tenants]    ([Id]),
    [StartDate]         DATETIME2        NOT NULL,
    [EndDate]           DATETIME2        NULL,
    [MonthlyRentAmount] DECIMAL(18, 2)   NULL,
    [Status]            NVARCHAR(50)     NOT NULL   -- Active | Inactive
);
