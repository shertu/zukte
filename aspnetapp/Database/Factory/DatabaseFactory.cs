using System.Collections.Generic;
using ChanceNET;

namespace Zukte.Database.Factory {
	public abstract class DatabaseFactory<T> {
		public static readonly Chance chance = new ConcurrentChance();

		public IDictionary<string, bool> State { get; } = new Dictionary<string, bool>();

		public abstract T CreateInstance();
	}
}
