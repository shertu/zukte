using Microsoft.EntityFrameworkCore;

namespace Zukte.Database;
public class ApplicationDbContext : DbContext
{
  protected ApplicationDbContext() : base() { }
  public ApplicationDbContext(DbContextOptions options) : base(options) { }

  public DbSet<ApplicationUser> ApplicationUsers { get; set; }

  public DbSet<ImageStorageElement> ImageStorageElements { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<ApplicationUser>()
        .HasKey(model => model.Id);


    modelBuilder.Entity<ImageStorageElement>()
        .HasKey(model => model.Url);
  }
}

