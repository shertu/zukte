using Microsoft.AspNetCore.Builder;

namespace Zukte.Middleware.DatabaseSeeder {
	public static class RequestCultureMiddlewareExtensions {
		public static IApplicationBuilder UseDatabaseSeeder(
			this IApplicationBuilder builder) {
			return builder.UseMiddleware<DatabaseSeederMiddleware>();
		}
	}
}