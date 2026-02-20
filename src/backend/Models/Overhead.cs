namespace PropPulse.Models;

public class Overhead
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int ServiceMonth { get; set; }
    public Guid PropertyId { get; set; }
    public Guid? LeaseId { get; set; }
    public DateTime DueDate { get; set; }
    public bool IsPaid { get; set; }

    public Property Property { get; set; } = null!;
    public Lease? Lease { get; set; }
}
