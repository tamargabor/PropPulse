namespace PropPulse.Models;

public class Tenant
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public Guid? UserId { get; set; }

    public User? User { get; set; }
    public ICollection<Lease> Leases { get; set; } = new List<Lease>();
}
