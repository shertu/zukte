using System.Threading.Tasks;

namespace Zukte.Database.Seeder {
	public interface IDatabaseSeeder {
		Task SeedTask(ApplicationDbContext context);
	}
}
