using System.Collections.Generic;
using ChanceNET;

namespace Zukte.Database.Factory {
	/// <summary>
	/// A base class for factories which create entities to seed a database.
	/// </summary>
	/// <typeparam name="T">The type of entity created.</typeparam>
	public abstract class DatabaseFactory<T> {
		public static readonly Chance chance = new ConcurrentChance();

		public abstract T CreateInstance();
	}
}
