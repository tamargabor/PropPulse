```mermaid
erDiagram
    PROPERTY ||--o{ LEASE : "has"
    PROPERTY ||--o{ OVERHEAD : "incurs"
    TENANT ||--o{ LEASE : "signs"
    LEASE ||--o{ OVERHEAD : "associated with"

    PROPERTY {
        guid Id
        string Title
        decimal MonthlyRent
    }
    TENANT {
        guid Id
        string FullName
        string Email
    }
    LEASE {
        guid Id
        datetime StartDate
        datetime EndDate
        decimal MonthlyRentAmount
    }
    OVERHEAD {
        guid Id
        string Type
        decimal Amount
        int ServiceMonth
    }