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
    OVERHEAD {
        string Type
        decimal Amount
        int ServiceMonth
    }