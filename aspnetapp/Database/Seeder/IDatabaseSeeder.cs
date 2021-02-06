using System.Threading.Tasks;

namespace Zukte.Database.Seeder {
	/// <summary>
	/// A base class for seeders which seed the <see cref="ApplicationDbContext"/>.
	/// </summary>
	public interface IDatabaseSeeder {
		Task SeedTask(ApplicationDbContext context);
	}
}
