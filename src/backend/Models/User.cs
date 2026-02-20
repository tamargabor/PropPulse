namespace PropPulse.Models;

public class User
{
    public Guid Id { get; set; }
    /// <summary>Azure Entra ID Subject / OID</summary>
    public string ExternalId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    /// <summary>Admin | Tenant</summary>
    public string Role { get; set; } = string.Empty;

    public Tenant? Tenant { get; set; }
}
