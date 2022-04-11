using Zukte.Database.Factory;
using Zukte.Middleware.DatabaseSeeder;

namespace Zukte.Database.Seeder;
public class ImageStorageElementSeeder : IDatabaseSeeder<ApplicationDbContext>
{
  private const int MINIMUM_COUNT = 37;

  public async Task InvokeSeed(ApplicationDbContext context)
  {
    var factory = new ImageStorageElementFactory();
    int count = context.ApplicationUsers.Count();
    int diff = MINIMUM_COUNT - count;

    for (int i = 0; i < diff; i++)
    {
      var instance = factory.CreateInstance();
      _ = await context.ImageStorageElements.AddAsync(instance);
    }
  }
}

