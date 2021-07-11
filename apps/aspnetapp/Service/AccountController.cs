using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using Zukte.Utilities;

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
    // private bool IsValidRedirectUrl(Uri url) {
    //   var origin = url.GetLeftPart(UriPartial.Authority);
    //   return allowedOrigins.Contains(origin);
    // }

    /// <summary>
    /// Starts the Google OAuth 2.0 flow for application sign in.
    /// </summary>
    [HttpGet("Login")]
    public IActionResult GoogleOpenIdConnectChallenge([FromQuery] string? returnUrl) {
      if (string.IsNullOrEmpty(returnUrl)) {
        return BadRequest($"{nameof(returnUrl)} is null or empty");
      }

      Uri uri = new Uri(returnUrl);

      // if (!IsValidRedirectUrl(redirectUri)) {
      //   return BadRequest($"\"{redirectUri}\" is an invalid redirect url");
      // }

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
    public IActionResult HttpContextSignOut([FromQuery] string? returnUrl) {
      if (string.IsNullOrEmpty(returnUrl)) {
        return BadRequest($"{nameof(returnUrl)} is null or empty");
      }

      Uri uri = new Uri(returnUrl);

      // if (!IsValidRedirectUrl(redirectUri)) {
      //   return BadRequest($"\"{redirectUri}\" is an invalid redirect url");
      // }

      AuthenticationProperties authenticationProperties = new AuthenticationProperties {
        RedirectUri = uri.AbsoluteUri,
      };

      return SignOut(authenticationProperties, new string[] { CookieAuthenticationDefaults.AuthenticationScheme });
    }
  }
}
