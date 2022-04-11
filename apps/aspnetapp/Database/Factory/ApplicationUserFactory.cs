namespace Zukte.Database.Factory;
public class ApplicationUserFactory : EntityFactory<ApplicationUser>
{
  public override ApplicationUser CreateInstance()
  {
    var instance = new ApplicationUser();
    instance.Id = chance.Guid();
    instance.Name = chance.FullName();
    instance.Picture = chance.Avatar();
    return instance;
  }
}

