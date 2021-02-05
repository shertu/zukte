using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Zukte.Authorization.Handlers;

namespace Zukte {
	public class Startup {
		private readonly IConfiguration _configuration;

		public Startup(IConfiguration configuration) {
			_configuration = configuration;
		}
		public void ConfigureServices(IServiceCollection services) {
			// #region Azure Blob Storage
			// // Account -> Container -> Blob
			// string? azureStorageConnectionString = _configuration.GetConnectionString("AzureStorageConnection");

			// if (!string.IsNullOrEmpty(azureStorageConnectionString)) {
			// 	BlobServiceClient blobServiceClient = new BlobServiceClient(azureStorageConnectionString);
			// 	services.AddSingleton(blobServiceClient);
			// }
			// #endregion

			#region database
			string? databaseConnectionString = _configuration.GetConnectionString("DatabaseConnection");

			if (!string.IsNullOrEmpty(databaseConnectionString)) {
				services.AddDbContext<Database.ApplicationDbContext>(options =>
				  options.UseMySQL(databaseConnectionString));
			}
			#endregion

			#region AccountCreator instance
			Utilities.AccountCreator? accountCreator = null;
			services.AddSingleton(serviceProvider => {
				var options = serviceProvider.GetService<Database.ApplicationDbContext>() ??
					throw new System.ArgumentNullException(nameof(Database.ApplicationDbContext));

				accountCreator = new Utilities.AccountCreator(options);
				return accountCreator;
			});
			#endregion

			#region Authentication
			// This configures Google.Apis.Auth.AspNetCore3 for use in this app.
			services
				.AddAuthentication(options => {
					// // This forces challenge results to be handled by Google OpenID Handler, so there's no
					// // need to add an AccountController that emits challenges for Login.
					// o.DefaultChallengeScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;

					// // This forces forbid results to be handled by Google OpenID Handler, which checks if
					// // extra scopes are required and does automatic incremental auth.
					// o.DefaultForbidScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;

					// Default scheme that will handle everything else.
					// Once a user is authenticated, the OAuth2 token info is stored in cookies.
					// After a user is signed in, auto create an account
					options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
				}).AddCookie(options => {
					options.Events = new Authentication.CustomCookieAuthenticationEvents {
						accountCreator = accountCreator,
					};

					options.LoginPath = "/api/Account/Login";
					options.LogoutPath = "/api/Account/Logout";
					// }).AddGoogleOpenIdConnect(options => {
					// 	options.ClientId = _configuration["Authentication:Google:ClientId"];
					// 	options.ClientSecret = _configuration["Authentication:Google:ClientSecret"];
				});
			#endregion

			#region Authorization
			services.AddAuthorization();
			services.AddSingleton<IAuthorizationHandler, SuperuserAuthorizationHandler>();
			services.AddSingleton<IAuthorizationHandler, MineApplicationUserAuthorizationHandler>();
			#endregion

			services.AddControllers();
			services.AddSwaggerDocument();
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger) {
			if (env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();

				foreach (var configurationSection in _configuration.GetChildren()) {
					logger.LogTrace($"{configurationSection.Key} {configurationSection.Value}");
				}
			}

			// // #region UseRewriter
			// // RewriteOptions rewriteOptions = new RewriteOptions()
			// //   //   .AddRewrite("privacy-policy", "index.html", true)
			// //   //   .AddRewrite("authentication-demo", SPA_ENTRY_FILENAME, true)
			// //   //   .AddRewrite("image-share-demo", SPA_ENTRY_FILENAME, true)
			// //   //   .AddRewrite("map-demo", SPA_ENTRY_FILENAME, true)
			// //   ;

			// // app.UseRewriter(rewriteOptions);
			// // #endregion

			app.UseDefaultFiles();

			#region UseStaticFiles
			StaticFileOptions staticFileOptions = new StaticFileOptions {
				OnPrepareResponse = staticFileResponseContext => {
					staticFileResponseContext.Context.Response.Headers.Add("Cache-Control", $"public, max-age={System.TimeSpan.FromDays(7).Seconds}");
				}
			};
			app.UseStaticFiles(staticFileOptions);
			#endregion

			app.UseRouting();

			// #region cookie policy
			// app.UseCookiePolicy(new CookiePolicyOptions {
			// 	Secure = CookieSecurePolicy.SameAsRequest,
			// 	HttpOnly = HttpOnlyPolicy.Always,
			// 	MinimumSameSitePolicy = SameSiteMode.None,
			// });
			// #endregion

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseEndpoints(endpoints => {
				_ = endpoints.MapControllers();
			});

			#region OpenApi
			_ = app.UseOpenApi();
			_ = app.UseSwaggerUi3();
			#endregion
		}
	}
}
