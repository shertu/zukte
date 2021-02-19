using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Zukte.Database;

namespace Zukte.Middleware.DatabaseSeeder {
	public class DatabaseSeederMiddleware {
		private static bool invoked;

		private readonly RequestDelegate _next;

		public DatabaseSeederMiddleware(RequestDelegate next) {
			_next = next;
		}

		public async Task InvokeAsync(HttpContext context, ApplicationDbContext database) {
			if (!invoked) {
				await DatabaseSeeder.GlobalDatabaseSeeder<ApplicationDbContext>.InvokeAsync(database);
				invoked = true;
			}

			// Call the next delegate/middleware in the pipeline
			await _next(context);
		}
	}
}