using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Zukte.Database.Seeder {
	/// <summary>
	/// Represents a <see cref="DbContext"/> database seeder.
	/// </summary>
	public interface IDatabaseSeeder<T> where T : DbContext {
		Task InvokeSeed(T context);
	}
}
