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
        Email NVARCHAR(200) NOT NULL,
        PhoneNumber NVARCHAR(50) NULL
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
        Status NVARCHAR(50) NOT NULL
    );
END

-- Create Overhead table if not exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Overheads')
BEGIN
    CREATE TABLE Overheads (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        PropertyId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Properties(Id),
        LeaseId UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Leases(Id),
        Amount DECIMAL(18, 2) NOT NULL,
        OverheadType NVARCHAR(100) NOT NULL,
        ServiceMonth INT NOT NULL,
        DueDate DATETIME2 NOT NULL,
        IsPaid BIT DEFAULT 0
    );
END