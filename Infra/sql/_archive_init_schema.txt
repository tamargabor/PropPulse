-- Create Users table if not exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        ExternalId NVARCHAR(200) NOT NULL,   -- Entra Subject ID
        Email NVARCHAR(200) NOT NULL,
        Role NVARCHAR(50) NOT NULL            -- Admin | Tenant
    );
END

-- Create Properties table if not exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Properties')
BEGIN
    CREATE TABLE Properties (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Title NVARCHAR(200) NOT NULL,
        Address NVARCHAR(500) NOT NULL,
        City NVARCHAR(100) NOT NULL,
        MonthlyRent DECIMAL(18, 2) NULL
    );
END

-- Create Tenants table if not exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tenants')
BEGIN
    CREATE TABLE Tenants (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        FullName NVARCHAR(200) NOT NULL,
        PhoneNumber NVARCHAR(50) NULL,
        UserId UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Users(Id)
    );
END

-- Create Leases table if not exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Leases')
BEGIN
    CREATE TABLE Leases (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        PropertyId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Properties(Id),
        TenantId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Tenants(Id),
        StartDate DATETIME2 NOT NULL,
        EndDate DATETIME2 NOT NULL,
        MonthlyRentAmount DECIMAL(18, 2) NOT NULL,
        Status NVARCHAR(50) NOT NULL          -- Active | Inactive
    );
END

-- Create Overhead table if not exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Overheads')
BEGIN
    CREATE TABLE Overheads (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Type NVARCHAR(100) NOT NULL,
        Amount DECIMAL(18, 2) NOT NULL,
        ServiceMonth INT NOT NULL,
        PropertyId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Properties(Id),
        LeaseId UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Leases(Id),
        DueDate DATETIME2 NOT NULL,
        IsPaid BIT NOT NULL DEFAULT 0
    );
END