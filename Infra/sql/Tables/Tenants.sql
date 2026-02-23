CREATE TABLE [dbo].[Tenants]
(
    [Id]          UNIQUEIDENTIFIER NOT NULL CONSTRAINT [PK_Tenants] PRIMARY KEY DEFAULT NEWID(),
    [FullName]    NVARCHAR(200)    NOT NULL,
    [PhoneNumber] NVARCHAR(50)     NULL,
    [UserId]      UNIQUEIDENTIFIER NULL CONSTRAINT [FK_Tenants_Users] FOREIGN KEY REFERENCES [dbo].[Users] ([Id])
);
