using Zukte.Database.Factory;
using Zukte.Middleware.DatabaseSeeder;

namespace Zukte.Database.Seeder;
public class ApplicationUserSeeder : IDatabaseSeeder<ApplicationDbContext>
{
  private const int MINIMUM_COUNT = 56;

  public async Task InvokeSeed(ApplicationDbContext context)
  {
    var factory = new ApplicationUserFactory();
    int count = context.ApplicationUsers.Count();
    int diff = MINIMUM_COUNT - count;

    for (int i = 0; i < diff; i++)
    {
      var instance = factory.CreateInstance();
      _ = await context.ApplicationUsers.AddAsync(instance);
    }
  }
}

