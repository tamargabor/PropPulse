namespace PropPulse.Models;

public class Lease
{
    public Guid Id { get; set; }
    public Guid PropertyId { get; set; }
    public Guid TenantId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal MonthlyRentAmount { get; set; }
    /// <summary>Active | Inactive</summary>
    public string Status { get; set; } = string.Empty;

    public Property Property { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
    public ICollection<Overhead> Overheads { get; set; } = new List<Overhead>();
}
