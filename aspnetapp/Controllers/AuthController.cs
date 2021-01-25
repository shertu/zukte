using Google.Apis.Auth.AspNetCore3;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Requests;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using zukte.Utilities;

namespace zukte.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase {
		private const string POST_SIGNIN_REDIRECT_URI_DEFAULT = "~/";

		private readonly MineApplicationUserController mineApplicationUserController;

		public AuthController(MineApplicationUserController mineApplicationUserController) {
			this.mineApplicationUserController = mineApplicationUserController;
		}

		/// <summary>
		/// Starts the Google OAuth 2.0 flow by redirecting the user to the Google login page with the specified scopes.
		/// </summary>
		[HttpGet("SignIn")]
		public async Task<IActionResult> GoogleOpenIdConnectChallenge([FromQuery] string? postSignInRedirectUri, [FromQuery] string? returnUrl = null) {
			if (User.Identity == null) {
				throw new ArgumentNullException("The user's claims principle has no identity.");
			}
			// ideally this method does not get called after authenticating
			// customize userEvents.OnTokenResponseReceived
			// Cookie AuthenticationOptions ReturnUrlParameter could be the answer

			if (User.Identity.IsAuthenticated) {
				mineApplicationUserController.ControllerContext = ControllerContext;
				_ = await mineApplicationUserController.PostMineApplicationUser();
				return LocalRedirect(postSignInRedirectUri ?? POST_SIGNIN_REDIRECT_URI_DEFAULT);
			} else {
				return Challenge(new string[] { GoogleOpenIdConnectDefaults.AuthenticationScheme });
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
