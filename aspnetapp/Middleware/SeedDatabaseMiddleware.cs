using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Zukte.Middleware {
	/// <summary>
	/// Middleware to seed a <see cref="DbContext"/> database for development and testing.
	/// </summary>
	public class SeedDatabaseMiddleware<T> where T : DbContext {
		private readonly RequestDelegate _next;

		public SeedDatabaseMiddleware(RequestDelegate next) {
			_next = next;
		}

		public async Task InvokeAsync(HttpContext context, T dbContext) {
			bool created = dbContext.Database.EnsureCreated();

			foreach (var item in GetDatabaseSeeders()) {
				if (item is IDatabaseSeeder<T> seeder) {
					await seeder.InvokeSeed(dbContext);
				}
			}

			dbContext.SaveChanges();

			// Call the next delegate/middleware in the pipeline
			await _next(context);
		}

		private static IEnumerable<Type> GetDatabaseSeeders() {
			var type = typeof(IDatabaseSeeder<T>);
			var types = AppDomain.CurrentDomain.GetAssemblies()
				.SelectMany(s => s.GetTypes())
				.Where(p => type.IsAssignableFrom(p) && p.IsClass);

			return types;
		}
	}
}