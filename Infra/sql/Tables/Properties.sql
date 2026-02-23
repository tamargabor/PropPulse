CREATE TABLE [dbo].[Properties]
(
    [Id]          UNIQUEIDENTIFIER NOT NULL CONSTRAINT [PK_Properties] PRIMARY KEY DEFAULT NEWID(),
    [Title]       NVARCHAR(200)    NOT NULL,
    [Address]     NVARCHAR(500)    NOT NULL,
    [City]        NVARCHAR(100)    NOT NULL,
    [MonthlyRent] DECIMAL(18, 2)   NULL
);
