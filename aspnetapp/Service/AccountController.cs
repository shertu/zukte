using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace zukte.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : ControllerBase {
		public const string RETURN_URL_DEFAULT = "/";

		/// <summary>
		/// Starts the Google OAuth 2.0 flow for application sign in.
		/// </summary>
		[HttpGet("Login")]
		public IActionResult GoogleOpenIdConnectChallenge([FromQuery] string? ReturnUrl) {
			ReturnUrl ??= RETURN_URL_DEFAULT;

			if (!Url.IsLocalUrl(ReturnUrl)) {
				return BadRequest($"\"{ReturnUrl}\" is not a local url");
			}

			AuthenticationProperties authenticationProperties = new AuthenticationProperties {
				RedirectUri = ReturnUrl,
			};

			bool isAuthenticated = User.Identity?.IsAuthenticated ?? false;
			if (isAuthenticated) {
				return LocalRedirect(authenticationProperties.RedirectUri);
			} else {
				return Challenge(authenticationProperties, new string[] { GoogleOpenIdConnectDefaults.AuthenticationScheme });
			}
		}

		/// <summary>
		/// An action result that on execution will sign out the user.
		/// </summary>
		[HttpDelete("Logout")]
		public IActionResult HttpContextSignOut([FromQuery] string? ReturnUrl) {
			ReturnUrl ??= RETURN_URL_DEFAULT;

			if (!Url.IsLocalUrl(ReturnUrl)) {
				return BadRequest($"\"{ReturnUrl}\" is not a local url");
			}

			AuthenticationProperties authenticationProperties = new AuthenticationProperties {
				RedirectUri = ReturnUrl,
			};

			return SignOut(authenticationProperties, new string[] { CookieAuthenticationDefaults.AuthenticationScheme });
		}
	}
}
