using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Zukte.Database.Seeder {
	/// <summary>
	/// A collection of <see cref="DbContext"/> database seeders for development and testing.
	/// </summary>
	public class SeedDatabaseMiddleware<T> where T : DbContext {
		private ICollection<IDatabaseSeeder<T>> Seeders { get; } = new List<IDatabaseSeeder<T>>();

		public async Task InvokeAsync(T dbContext) {
			bool created = dbContext.Database.EnsureCreated();

			foreach (var seeder in Seeders) {
				await seeder.InvokeSeed(dbContext);
			}

			await dbContext.SaveChangesAsync();
		}

		public void Add(IDatabaseSeeder<T> item) {
			Seeders.Add(item);
		}
	}
}