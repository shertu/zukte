using System.Threading.Tasks;

namespace Zukte.Database.Seeder {
	/// <summary>
	/// Represents a seeder for the <see cref="ApplicationDbContext"/>.
	/// </summary>
	public interface IDatabaseSeeder {
		Task SeedTask(ApplicationDbContext context);
	}
}
