using System.IO;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Zukte.Authentication;
using Zukte.Authorization.Handlers;
using Zukte.Database;
using Zukte.Middleware;
using Zukte.Utilities.Account;

namespace Zukte {
	public class Startup {
		/// <summary>
		/// The name of the CORS policy used during development to allow
		/// webpack-dev-server origins to connect to the .NET server.
		/// </summary>
		private const string CORS_POLICY_NAME_DEVLOPMENT = "webpack-dev-server";

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
				services.AddDbContext<ApplicationDbContext>(options =>
				  options.UseMySQL(databaseConnectionString));
			}
			#endregion

			#region Authentication
			// This configures Google.Apis.Auth.AspNetCore3 for use in this app.
			services
				.AddAuthentication(options => {
					// // This forces challenge results to be handled by Google OpenID Handler, so there's no
					// // need to add an AccountController that emits challenges for Login.
					// o.DefaultChallengeScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;

					// This forces forbid results to be handled by Google OpenID Handler, which checks if
					// extra scopes are required and does automatic incremental auth.
					// options.DefaultForbidScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;

					// Default scheme that will handle everything else.
					// Once a user is authenticated, the OAuth2 token info is stored in cookies.
					// After a user is signed in, auto create an account
					options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
				}).AddCookie(options => {
					// options.Cookie.Domain
					options.EventsType = typeof(CustomCookieAuthenticationEvents);
					options.LoginPath = "/api/Account/Login";
					options.LogoutPath = "/api/Account/Logout";
				}).AddGoogleOpenIdConnect(options => {
					options.ClientId = _configuration["Authentication:Google:ClientId"];
					options.ClientSecret = _configuration["Authentication:Google:ClientSecret"];

					// options.NonceCookie.SameSite = SameSiteMode.Unspecified;
					// options.CorrelationCookie.SameSite = SameSiteMode.Unspecified;
				});
			#endregion

			services.AddScoped<IAccountCreationService, AccountCreationService>();
			services.AddScoped<CustomCookieAuthenticationEvents>();

			#region Authorization
			services.AddAuthorization();
			services.AddSingleton<IAuthorizationHandler, SuperuserAuthorizationHandler>();
			services.AddSingleton<IAuthorizationHandler, MineApplicationUserAuthorizationHandler>();
			#endregion

			#region CORS
			services.AddCors(options => {
				options.AddPolicy(name: CORS_POLICY_NAME_DEVLOPMENT, builder => {
					builder
						// add origins for webpack-dev-server
						.WithOrigins("http://localhost:8080")
						.AllowCredentials();
				});
			});
			#endregion

			services.AddControllers();

			#region OpenAPI
			services.AddSwaggerDocument();
			#endregion

			//services.AddSingleton<ConfigurationLogger>();
		}

		public void Configure(
			IApplicationBuilder app,
			IWebHostEnvironment env,
			ApplicationDbContext dbContext) {
			if (env.IsDevelopment()) {
				_ = app.UseDeveloperExceptionPage();
				_ = SeedDatabaseMiddleware.InvokeAsync(dbContext);
			}

			#region UseRewriter
			RewriteOptions rewriteOptions = new RewriteOptions();
			LoadApplicationRouteInfo(rewriteOptions);
			_ = app.UseRewriter(rewriteOptions);
			#endregion

			_ = app.UseDefaultFiles();

			#region UseStaticFiles
			StaticFileOptions staticFileOptions = new StaticFileOptions {
				OnPrepareResponse = staticFileResponseContext => {
					staticFileResponseContext.Context.Response.Headers
					.Add("Cache-Control", $"public, max-age={System.TimeSpan.FromDays(7).Seconds}");
				}
			};
			_ = app.UseStaticFiles(staticFileOptions);
			#endregion

			_ = app.UseRouting();

			// allow Cross-Origin Resource Sharing (CORS) in development mode
			// if (env.IsDevelopment()) {
			// 	_ = app.UseCors(CORS_POLICY_NAME_DEVLOPMENT);
			// }

			_ = app.UseAuthentication();
			_ = app.UseAuthorization();

			app.UseEndpoints(endpoints => {
				_ = endpoints.MapControllers();
			});

			#region OpenAPI
			_ = app.UseOpenApi();
			_ = app.UseSwaggerUi3();
			#endregion
		}

		public static readonly string[] RewriteRouteCollection = {
			"privacy-policy", "authentication-demo", "image-share-demo", "map-demo"};

		private void LoadApplicationRouteInfo(RewriteOptions rewrite) {
			foreach (var item in RewriteRouteCollection) {
				rewrite.AddRewrite(item, "/", true);
			}
		}
	}
}
