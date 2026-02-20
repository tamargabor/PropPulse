namespace PropPulse.Models;

public class Property
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal? MonthlyRent { get; set; }

    public ICollection<Lease> Leases { get; set; } = new List<Lease>();
    public ICollection<Overhead> Overheads { get; set; } = new List<Overhead>();
}
