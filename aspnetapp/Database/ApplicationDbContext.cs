using Microsoft.EntityFrameworkCore;
using Zukte.Message.ApplicatonUser;

namespace Zukte.Database {
	public class ApplicationDbContext : DbContext {
		protected ApplicationDbContext() : base() { }
		public ApplicationDbContext(DbContextOptions options) : base(options) { }

		public DbSet<ApplicationUser>? ApplicationUsers { get; set; }

		/// <summary>
		/// Further configure the database model.
		/// </summary>
		protected override void OnModelCreating(ModelBuilder modelBuilder) {
		}
	}
}
