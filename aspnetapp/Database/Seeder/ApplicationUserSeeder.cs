using System;
using System.Linq;
using System.Threading.Tasks;
// using System.Linq;
using Zukte.Database.Factory;

namespace Zukte.Database.Seeder {
	public class ApplicationUserSeeder : IDatabaseSeeder {
		private const int MINIMUM_COUNT = 56;
		private ApplicationUserFactory factory = new ApplicationUserFactory();

		public async Task SeedTask(ApplicationDbContext context) {
			if (context.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(context.ApplicationUsers));

			int count = context.ApplicationUsers.Count();
			int diff = MINIMUM_COUNT - count;

			for (int i = 0; i < diff; i++) {
				var user = factory.CreateInstance();
				_ = await context.ApplicationUsers.AddAsync(user);
			}
		}
	}
}
