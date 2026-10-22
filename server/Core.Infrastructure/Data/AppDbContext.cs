using System.Reflection;
using Core.Domain.Entities;
using Core.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Core.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectSpec> ProjectSpecs { get; set; }
    public DbSet<ProjectTechStack> ProjectTechStacks { get; set; }
    public DbSet<SkillCategory> SkillCategories { get; set; }
    public DbSet<SkillItem> SkillItems { get; set; }
    public DbSet<GuestbookEntry> GuestbookEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Applies all Entity Configurations
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}