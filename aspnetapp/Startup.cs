using System.Linq;
using Azure.Storage.Blobs;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
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
using zukte.Security.Authentication;
using zukte.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Formatters;
using System.Text.Json;

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
			#region Google OAuth 2.0
			GoogleAuthorizationCodeFlow.Initializer authInitializer = new GoogleAuthorizationCodeFlow.Initializer {
				ClientSecrets = new ClientSecrets {
					ClientId = _configuration["Authentication:Google:ClientId"],
					ClientSecret = _configuration["Authentication:Google:ClientSecret"]
				},
				DataStore = GoogleDataStores.GOOGLE_AUTH_TOKEN_STORE,
				IncludeGrantedScopes = true,
				Scopes = new string[] {
		  @"https://www.googleapis.com/auth/userinfo.profile",
		},
			};

			_ = services.AddScoped(elem => authInitializer);
			_ = services.AddScoped<GoogleCredentialManager>();
			#endregion

			#region routing
			_ = services.AddControllers();
			#endregion

			#region authentication
			_ = services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
			  .AddCookie(options => {
				  options.Events = new CustomCookieAuthenticationEvents();
			  });
			#endregion

			#region authorization
			_ = services.AddAuthorization(options => {
			});

			_ = services.AddSingleton<IAuthorizationHandler, SuperuserAuthorizationHandler>();
			_ = services.AddSingleton<IAuthorizationHandler, ApplicationUserOwnerAuthorizationHandler>();
			#endregion

			#region openapi
			_ = services.AddSwaggerDocument();
			#endregion

			#region database
			string databaseConnectionString = _configuration.GetConnectionString("DatabaseConnection");

			if (databaseConnectionString != null) {
				_ = services.AddDbContext<ApplicationDbContext>(options =>
				  options.UseSqlServer(databaseConnectionString));
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

			if (databaseConnectionString != null) {
				_ = services.AddScoped<MineApplicationUserController>();
				_ = services.AddScoped<ApplicationUsersController>();
			}
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
			_ = app.UseCookiePolicy(new CookiePolicyOptions {
				MinimumSameSitePolicy = SameSiteMode.Lax,
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
