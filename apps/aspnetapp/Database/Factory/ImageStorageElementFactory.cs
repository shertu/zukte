namespace Zukte.Database.Factory;
public class ImageStorageElementFactory : EntityFactory<ImageStorageElement>
{
  public override ImageStorageElement CreateInstance()
  {
    var instance = new ImageStorageElement();
    instance.Height = chance.Integer(0, 1000);
    instance.Width = chance.Integer(0, 1000);
    instance.Url = $"https://picsum.photos/{instance.Width}/{instance.Height}";
    return instance;
  }
}

