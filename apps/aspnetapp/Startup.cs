using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Linq;
using Zukte.Authentication;
using Zukte.Authorization.Handlers;
using Zukte.Database;
using Zukte.Middleware.DatabaseSeeder;
using Zukte.Utilities;
using Zukte.Utilities.Account;

namespace Zukte {
  public class Startup {
    private readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration) {
      _configuration = configuration;
      // by default, a missing configuration value is a severe or critical error
      // an automatic post-release test for configuration values would be desirable
    }

    public void ConfigureServices(IServiceCollection services) {
      #region database
      string? databaseConnectionString = _configuration.GetConnectionString("DatabaseConnection");

      if (!string.IsNullOrEmpty(databaseConnectionString)) {
        services.AddDbContext<ApplicationDbContext>(options =>
          options.UseMySQL(databaseConnectionString));
      } else {
        // this is a critical error
      }
      #endregion

      #region Azure Blob Storage
      string? azureStorageConnectionString = _configuration.GetConnectionString("AzureStorageConnection");

      if (!string.IsNullOrEmpty(azureStorageConnectionString)) {
        BlobServiceClient client = new BlobServiceClient(azureStorageConnectionString);
        services.AddSingleton<BlobServiceClient>(client);
      } else {
        // this is a severe error
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
            // HTTPS connection is required to use open id connect
            options.ClientId = _configuration["Authentication:Google:ClientId"];
            options.ClientSecret = _configuration["Authentication:Google:ClientSecret"];
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
      string[] origins = _configuration.GetAllowedOrigins().ToArray();

      services.AddCors(options => {
        options.AddPolicy(name: MyAllowSpecificOrigins,
            builder => {
              builder.WithOrigins(origins)
                .AllowCredentials();
            });
      });
      #endregion

      services.AddControllers();

      #region OpenAPI
      services.AddOpenApiDocument(); // add OpenAPI v3 document
      #endregion

      //services.AddSingleton<ConfigurationLogger>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      if (env.IsDevelopment()) {
        _ = app.UseDeveloperExceptionPage();
        _ = app.UseDatabaseSeeder();
      } else {
        _ = app.UseHsts(); // encourages production clients to use HTTPS
      }

      _ = app.UseRouting();

      #region CORS
      if (env.IsDevelopment()) {
        _ = app.UseCors(MyAllowSpecificOrigins);
      }
      #endregion

      _ = app.UseAuthentication();
      _ = app.UseAuthorization();

      app.UseEndpoints(endpoints => {
        _ = endpoints.MapControllers();
      });

      #region OpenAPI
      app.UseOpenApi(); // serve OpenAPI/Swagger documents
      app.UseSwaggerUi3(); // serve Swagger UI
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
