CREATE TABLE [dbo].[Overheads]
(
    [Id]           UNIQUEIDENTIFIER NOT NULL CONSTRAINT [PK_Overheads] PRIMARY KEY DEFAULT NEWID(),
    [Type]         NVARCHAR(100)    NOT NULL,
    [Amount]       DECIMAL(18, 2)   NOT NULL,
    [ServiceMonth] INT              NOT NULL,
    [PropertyId]   UNIQUEIDENTIFIER NOT NULL CONSTRAINT [FK_Overheads_Properties] FOREIGN KEY REFERENCES [dbo].[Properties] ([Id]),
    [LeaseId]      UNIQUEIDENTIFIER NULL     CONSTRAINT [FK_Overheads_Leases]     FOREIGN KEY REFERENCES [dbo].[Leases]     ([Id]),
    [DueDate]      DATETIME2        NOT NULL,
    [IsPaid]       BIT              NOT NULL CONSTRAINT [DF_Overheads_IsPaid] DEFAULT 0
);
