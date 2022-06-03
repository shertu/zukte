using Microsoft.EntityFrameworkCore;

namespace Zukte.Database;
public class ApplicationDbContext : DbContext
{
  protected ApplicationDbContext() : base() { }
  public ApplicationDbContext(DbContextOptions options) : base(options) { }

  public DbSet<ApplicationUser> ApplicationUsers => Set<ApplicationUser>();

  public DbSet<ImageStorageElement> ImageStorageElements => Set<ImageStorageElement>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<ApplicationUser>()
    .HasKey(model => model.Id);

    modelBuilder.Entity<ImageStorageElement>()
    .HasKey(model => model.Id);

    modelBuilder.Entity<ImageStorageElement>()
    .Property(model => model.Id)
    .ValueGeneratedOnAdd();
  }
}

