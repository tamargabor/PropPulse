using Microsoft.EntityFrameworkCore;
using PropPulse.Models;

namespace PropPulse.Database;

public class PropPulseDbContext : DbContext
{
    public PropPulseDbContext(DbContextOptions<PropPulseDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Lease> Leases => Set<Lease>();
    public DbSet<Overhead> Overheads => Set<Overhead>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Table name mappings (match init-schema.sql)
        modelBuilder.Entity<User>().ToTable("Users");
        modelBuilder.Entity<Property>().ToTable("Properties");
        modelBuilder.Entity<Tenant>().ToTable("Tenants");
        modelBuilder.Entity<Lease>().ToTable("Leases");
        modelBuilder.Entity<Overhead>().ToTable("Overheads");

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.Property(u => u.ExternalId).HasMaxLength(200).IsRequired();
            e.Property(u => u.Email).HasMaxLength(200).IsRequired();
            e.Property(u => u.Role).HasMaxLength(50).IsRequired();
        });

        // Property
        modelBuilder.Entity<Property>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Title).HasMaxLength(200).IsRequired();
            e.Property(p => p.Address).HasMaxLength(500).IsRequired();
            e.Property(p => p.City).HasMaxLength(100).IsRequired();
            e.Property(p => p.MonthlyRent).HasColumnType("decimal(18,2)");
        });

        // Tenant
        modelBuilder.Entity<Tenant>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.FullName).HasMaxLength(200).IsRequired();
            e.Property(t => t.PhoneNumber).HasMaxLength(50);
            e.HasOne(t => t.User)
             .WithOne(u => u.Tenant)
             .HasForeignKey<Tenant>(t => t.UserId)
             .IsRequired(false);
        });

        // Lease
        modelBuilder.Entity<Lease>(e =>
        {
            e.HasKey(l => l.Id);
            e.Property(l => l.MonthlyRentAmount).HasColumnType("decimal(18,2)").IsRequired();
            e.Property(l => l.Status).HasMaxLength(50).IsRequired();
            e.HasOne(l => l.Property)
             .WithMany(p => p.Leases)
             .HasForeignKey(l => l.PropertyId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(l => l.Tenant)
             .WithMany(t => t.Leases)
             .HasForeignKey(l => l.TenantId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Overhead
        modelBuilder.Entity<Overhead>(e =>
        {
            e.HasKey(o => o.Id);
            e.Property(o => o.Type).HasMaxLength(100).IsRequired();
            e.Property(o => o.Amount).HasColumnType("decimal(18,2)").IsRequired();
            e.HasOne(o => o.Property)
             .WithMany(p => p.Overheads)
             .HasForeignKey(o => o.PropertyId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(o => o.Lease)
             .WithMany(l => l.Overheads)
             .HasForeignKey(o => o.LeaseId)
             .IsRequired(false)
             .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
