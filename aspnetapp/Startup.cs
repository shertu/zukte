using System.Linq;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using zukte.Authorization.Handlers;
using zukte.Controllers;
using zukte.Database;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth.AspNetCore3;
using zukte.Security.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace zukte {
	public class Startup {
		/// <summary>
		/// The name of the file to serve when the user accesses the web server.zs
		/// </summary>
		private const string SPA_ENTRY_FILENAME = "index.html";

		/// <summary>
		/// Represents a set of key/value application configuration properties.
		/// </summary>
		private readonly IConfiguration _configuration;

		public Startup(IConfiguration configuration) {
			_configuration = configuration;
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services) {
			#region routing
			_ = services.AddControllers();
			#endregion

			// The following LoC was added to prevent breaking changes with Chrome 80
			// services.ConfigureNonBreakingSameSiteCookies();

			#region authentication
			// This configures Google.Apis.Auth.AspNetCore3 for use in this app.
			services
				.AddAuthentication(o => {
					// // This forces challenge results to be handled by Google OpenID Handler, so there's no
					// // need to add an AccountController that emits challenges for Login.
					// o.DefaultChallengeScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;

					// // This forces forbid results to be handled by Google OpenID Handler, which checks if
					// // extra scopes are required and does automatic incremental auth.
					// o.DefaultForbidScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;

					// Default scheme that will handle everything else.
					// Once a user is authenticated, the OAuth2 token info is stored in cookies.
					o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
				}).AddCookie(o => {
					o.Events = new CustomCookieAuthenticationEvents();
				}).AddGoogleOpenIdConnect(o => {
					o.ClientId = _configuration["Authentication:Google:ClientId"];
					o.ClientSecret = _configuration["Authentication:Google:ClientSecret"];
				});
			#endregion

			#region authorization
			_ = services.AddAuthorization();

			_ = services.AddSingleton<IAuthorizationHandler, SuperuserAuthorizationHandler>();
			_ = services.AddSingleton<IAuthorizationHandler, MineApplicationUserAuthorizationHandler>();
			#endregion

			#region openapi
			_ = services.AddSwaggerDocument();
			#endregion

			#region database
			string databaseConnectionString = _configuration.GetConnectionString("DatabaseConnection");

			if (databaseConnectionString != null) {
				_ = services.AddDbContext<ApplicationDbContext>(options =>
				  options.UseMySQL(databaseConnectionString));
			}
			#endregion

			#region Azure Blob Storage
			// Account -> Container -> Blob
			string azureStorageConnectionString = _configuration.GetConnectionString("AzureStorageConnection");

			if (azureStorageConnectionString != null) {
				BlobServiceClient blobServiceClient = new BlobServiceClient(azureStorageConnectionString);
				_ = services.AddSingleton(blobServiceClient);
			}
			#endregion

			#region Custom Dependency Injections
			try {
				_ = services.AddScoped<MineApplicationUserController>();
				_ = services.AddScoped<ApplicationUsersController>();
			} catch (System.Exception) {
			}
			#endregion
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
			// https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware/ 

			#region developer exception
			_ = app.UseDeveloperExceptionPage();
			#endregion

			#region rewrite
			RewriteOptions rewriteOptions = new RewriteOptions()
			  .AddRewrite("privacy-policy", SPA_ENTRY_FILENAME, true)
			  .AddRewrite("authentication-demo", SPA_ENTRY_FILENAME, true)
			  .AddRewrite("image-share-demo", SPA_ENTRY_FILENAME, true)
			  .AddRewrite("map-demo", SPA_ENTRY_FILENAME, true)
			  ;

			_ = app.UseRewriter(rewriteOptions);
			#endregion

			#region static content
			_ = app.UseDefaultFiles(); // adds the base route to index.html

			StaticFileOptions staticFileOptions = new StaticFileOptions {
				OnPrepareResponse = staticFileResponseContext => {
					staticFileResponseContext.Context.Response.Headers.Append("Cache-Control", $"public, max-age={System.TimeSpan.FromDays(7).Seconds}");
				}
			};

			_ = app.UseStaticFiles(staticFileOptions);
			#endregion

			#region routing
			_ = app.UseRouting();
			#endregion

			#region cookie policy
			app.UseCookiePolicy(new CookiePolicyOptions {
				MinimumSameSitePolicy = SameSiteMode.None,
			});
			#endregion

			#region authentication and authorization
			_ = app.UseAuthentication();
			_ = app.UseAuthorization();
			#endregion

			#region endpoints
			_ = app.UseEndpoints(endpoints => {
				_ = endpoints.MapControllers();
			});
			#endregion

			#region openapi
			app.UseOpenApi();
			app.UseSwaggerUi3();
			#endregion
		}
	}
}
