using Microsoft.EntityFrameworkCore;
using zukte.Models;

namespace zukte.Database {
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
