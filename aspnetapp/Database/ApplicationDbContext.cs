using Microsoft.EntityFrameworkCore;
using zukte.com.Models;

namespace zukte.com.Database {
  public class ApplicationDbContext : DbContext {
    protected ApplicationDbContext() : base() { }
    public ApplicationDbContext(DbContextOptions options) : base(options) { }

    public DbSet<ApplicationUser>? ApplicationUsers { get; set; }

    /// <summary>
    /// Further configure the database model.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder) { }
  }
}
