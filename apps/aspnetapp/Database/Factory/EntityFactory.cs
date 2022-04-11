using ChanceNET;

namespace Zukte.Database.Factory;
/// <summary>
/// Represents a factory which creates entities to seed a database.
/// </summary>
/// <typeparam name="T">The type of entity created.</typeparam>
public abstract class EntityFactory<T>
{
  protected static readonly Chance chance = new ConcurrentChance();

  public abstract T CreateInstance();
}

