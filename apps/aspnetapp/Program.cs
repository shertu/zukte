using Zukte.Middleware.DatabaseSeeder;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Zukte.Authentication;
using Zukte.Authorization.Handlers;
using Zukte.Utilities;
using Zukte.Utilities.Account;
using Zukte.Database;

var builder = WebApplication.CreateBuilder(args);
// by default, a missing configuration value is a severe or critical error

Console.WriteLine(string.Join(",\n", builder.Configuration.AsEnumerable().ToArray()));

#region database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
  options.UseMySQL(
    builder.Configuration.GetConnectionString("DatabaseConnection")));
#endregion

#region IAM
#region Authentication
// This configures Google.Apis.Auth.AspNetCore3 for use in this app.
builder.Services
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
      options.Cookie.SameSite = SameSiteMode.None; // The client is on a different domain to the server

      // options.Cookie.Domain
      options.EventsType = typeof(CustomCookieAuthenticationEvents);
      options.LoginPath = "/api/Account/Login";
      options.LogoutPath = "/api/Account/Logout";
    }).AddGoogleOpenIdConnect(options => {
      // HTTPS connection is required to use open id connect
      options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
      options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    });
#endregion

builder.Services.AddScoped<IAccountCreationService, AccountCreationService>();
builder.Services.AddScoped<CustomCookieAuthenticationEvents>();

#region Authorization
builder.Services.AddAuthorization();
builder.Services.AddSingleton<IAuthorizationHandler, SuperuserAuthorizationHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, MineApplicationUserAuthorizationHandler>();
#endregion
#endregion

#region CORS
string[] allowedOrigins = builder.Configuration.GetAllowedOrigins();
builder.Services.AddCors(options => {
  options.AddDefaultPolicy(builder => {
    builder.WithOrigins(allowedOrigins)
      .AllowAnyMethod()     // GET, HEAD, or POST are defaults
      .AllowAnyHeader()     // required for production image share service
      .AllowCredentials();  // required for CORS authentication
  });
});
#endregion

builder.Services.AddControllers();

builder.Services.AddOpenApiDocument(); // add OpenAPI v3 document

#region proxy-load-balancer
// https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer
builder.Services.Configure<ForwardedHeadersOptions>(options => {
  options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;

  // Only loopback proxies are allowed by default. Clear that restriction because forwarders are
  // being enabled by explicit configuration.
  options.KnownNetworks.Clear();
  options.KnownProxies.Clear();
});
#endregion

#region Azure Blob Storage
Azure.Storage.Blobs.BlobServiceClient blobServiceClient = new Azure.Storage.Blobs.BlobServiceClient(
  builder.Configuration.GetConnectionString("AzureStorageConnection"));
builder.Services.AddSingleton<Azure.Storage.Blobs.BlobServiceClient>(blobServiceClient);
#endregion

#region Square
Square.SquareClient squareClient = new Square.SquareClient.Builder()
  .Environment(Square.Environment.Sandbox)
  .AccessToken(builder.Configuration["Authentication:Square:AccessToken"])
  .Build();

builder.Services.AddSingleton<Square.SquareClient>(squareClient);
#endregion

var app = builder.Build();

app.UseForwardedHeaders(); // proxy-load-balancer

if (app.Environment.IsDevelopment()) {
  app.UseDatabaseSeeder();
} else {
  app.UseHsts(); // encourages production clients to use HTTPS
}

app.UseRouting();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// OpenAPI
app.UseOpenApi(); // serve OpenAPI/Swagger documents
app.UseSwaggerUi3(); // serve Swagger UI

app.Run();
