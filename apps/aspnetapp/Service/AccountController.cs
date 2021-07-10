using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace Zukte.Service {
  [ApiController]
  [Route("api/[controller]")]
  public class AccountController : ControllerBase {
    public const string RETURN_URL_DEFAULT = "/";

    private bool OpenRedirectValidation(string? url) {
      if (string.IsNullOrEmpty(url)) {
        return false;
      }

      return Url.IsLocalUrl(url);
    }

    /// <summary>
    /// Starts the Google OAuth 2.0 flow for application sign in.
    /// </summary>
    [HttpGet("Login")]
    public IActionResult GoogleOpenIdConnectChallenge([FromQuery] string? ReturnUrl) {
      ReturnUrl ??= RETURN_URL_DEFAULT;

      if (!OpenRedirectValidation(ReturnUrl)) {
        return BadRequest($"\"{ReturnUrl}\" is not a local url");
      }

      AuthenticationProperties authenticationProperties = new AuthenticationProperties {
        RedirectUri = ReturnUrl,
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
    public IActionResult HttpContextSignOut([FromQuery] string? ReturnUrl) {
      ReturnUrl ??= RETURN_URL_DEFAULT;

      if (!OpenRedirectValidation(ReturnUrl)) {
        return BadRequest($"\"{ReturnUrl}\" is not a local url");
      }

      AuthenticationProperties authenticationProperties = new AuthenticationProperties {
        RedirectUri = ReturnUrl,
      };

      return SignOut(authenticationProperties, new string[] { CookieAuthenticationDefaults.AuthenticationScheme });
    }
  }
}
