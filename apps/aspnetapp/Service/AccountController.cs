using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Zukte.Service {
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase {
    // private readonly ICollection<string> allowedOrigins;

    // public AccountController(IConfiguration configuration) {
    //   allowedOrigins = configuration.GetAllowedOrigins().ToHashSet();
    // }

    /// <summary>
    /// Checks if specified url is safe against open redirect attacks.
    /// </summary>
    private bool TryValidateReturnUrl(string? returnUrl, out Uri? uri) {
      return Uri.TryCreate(returnUrl, UriKind.Absolute, out uri);
    }

    /// <summary>
    /// Starts the Google OAuth 2.0 flow for application sign in.
    /// </summary>
    [HttpGet("Login")]
    public IActionResult GoogleOpenIdConnectChallenge([FromQuery] string? returnUrl) {
      if (TryValidateReturnUrl(returnUrl, out Uri uri)) {
        AuthenticationProperties authenticationProperties = new AuthenticationProperties {
          RedirectUri = uri.AbsoluteUri,
        };

        bool isAuthenticated = User.Identity?.IsAuthenticated ?? false;
        if (isAuthenticated) {
          return Redirect(authenticationProperties.RedirectUri);
        } else {
          return Challenge(authenticationProperties, new string[] { GoogleOpenIdConnectDefaults.AuthenticationScheme });
        }
      } else {
        return BadRequest($"\"{returnUrl}\" is an invalid return url");
      }
    }

    /// <summary>
    /// Creates an action result that on execution will sign out the user.
    /// </summary>
    [HttpDelete("Logout")]
    public IActionResult HttpContextSignOut([FromQuery] string? returnUrl) {
      if (TryValidateReturnUrl(returnUrl, out Uri uri)) {
        AuthenticationProperties authenticationProperties = new AuthenticationProperties {
          RedirectUri = uri.AbsoluteUri,
        };

        return SignOut(authenticationProperties, new string[] { CookieAuthenticationDefaults.AuthenticationScheme });
      } else {
        return BadRequest($"\"{returnUrl}\" is an invalid return url");
      }
    }
  }
}
