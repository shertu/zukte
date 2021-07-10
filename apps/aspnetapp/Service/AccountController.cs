using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;

namespace Zukte.Service {
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase {
    private readonly IConfiguration _configuration;

    public AccountController(IConfiguration configuration) {
      _configuration = configuration;
    }

    public string defaultRedirectUrl => Request.Host.ToString();

    private bool OpenRedirectValidation(Uri uri) {
      IConfigurationSection originsSection = _configuration.GetSection("CorsOrigins");
      var origins = originsSection.GetChildren().Select(kv => kv.Value).ToHashSet();

      if (Url.IsLocalUrl(uri.AbsoluteUri)) {
        return true;
      } else {
        return origins.Contains(uri.Host);
      }
    }

    /// <summary>
    /// Starts the Google OAuth 2.0 flow for application sign in.
    /// </summary>
    [HttpGet("Login")]
    public IActionResult GoogleOpenIdConnectChallenge([FromQuery] string? redirectUrl) {
      Uri uri = new Uri(redirectUrl ?? defaultRedirectUrl);

      if (!OpenRedirectValidation(uri)) {
        return BadRequest($"\"{uri}\" is an invalid open redirect url");
      }

      AuthenticationProperties authenticationProperties = new AuthenticationProperties {
        RedirectUri = uri.AbsoluteUri,
      };

      bool isAuthenticated = User.Identity?.IsAuthenticated ?? false;
      if (isAuthenticated) {
        return Redirect(authenticationProperties.RedirectUri);
      } else {
        return Challenge(authenticationProperties, new string[] { GoogleOpenIdConnectDefaults.AuthenticationScheme });
      }
    }

    /// <summary>
    /// Creates an action result that on execution will sign out the user.
    /// </summary>
    [HttpDelete("Logout")]
    public IActionResult HttpContextSignOut([FromQuery] string? redirectUrl) {
      Uri uri = new Uri(redirectUrl ?? defaultRedirectUrl);

      if (!OpenRedirectValidation(uri)) {
        return BadRequest($"\"{uri}\" is an invalid open redirect url");
      }

      AuthenticationProperties authenticationProperties = new AuthenticationProperties {
        RedirectUri = uri.AbsoluteUri,
      };

      return SignOut(authenticationProperties, new string[] { CookieAuthenticationDefaults.AuthenticationScheme });
    }
  }
}
