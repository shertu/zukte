using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System;

namespace zukte.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase {
		private const string POST_SIGNIN_REDIRECT_URI_DEFAULT = "/";

		/// <summary>
		/// Starts the Google OAuth 2.0 flow for application sign in.
		/// </summary>
		[HttpGet("SignIn")]
		public IActionResult GoogleOpenIdConnectChallenge([FromQuery] string? postSignInRedirectUri = POST_SIGNIN_REDIRECT_URI_DEFAULT) {
			if (User.Identity == null) {
				throw new ArgumentNullException("The user's claims principle has no identity.");
			}

			if (!Url.IsLocalUrl(postSignInRedirectUri)) {
				return BadRequest($"\"{postSignInRedirectUri}\" is not a local url");
			}

			if (User.Identity.IsAuthenticated) {
				return LocalRedirect(postSignInRedirectUri);
			} else {
				var authenticationProperties = new AuthenticationProperties {
					RedirectUri = postSignInRedirectUri,
				};

				return Challenge(authenticationProperties, new string[] { GoogleOpenIdConnectDefaults.AuthenticationScheme });
			}
		}

		/// <summary>
		/// An action result that on execution will sign out the user.
		/// </summary>
		[HttpDelete("SignOut")]
		public SignOutResult HttpContextSignOut() {
			return SignOut();
		}
	}
}
