CREATE TABLE [dbo].[Users]
(
    [Id]         UNIQUEIDENTIFIER NOT NULL CONSTRAINT [PK_Users] PRIMARY KEY DEFAULT NEWID(),
    [ExternalId] NVARCHAR(200)    NOT NULL,  -- Entra Subject ID
    [Email]      NVARCHAR(200)    NOT NULL,
    [Role]       NVARCHAR(50)     NOT NULL   -- Admin | Tenant
);
