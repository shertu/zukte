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
		[Authorize]
		public async Task<IActionResult> SignInMethod([FromQuery] string? postSignInRedirectUri) {
			mineApplicationUserController.ControllerContext = ControllerContext;
			_ = await mineApplicationUserController.PostMineApplicationUser();
			return LocalRedirect(postSignInRedirectUri ?? POST_SIGNIN_REDIRECT_URI_DEFAULT);
		}

		/// <summary>
		/// An action result that on execution will sign out the user.
		/// </summary>
		[HttpGet("SignOut")]
		public SignOutResult SignOutMethod() {
			// if (User.Identity.IsAuthenticated) {
			// 	await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
			// }

			return SignOut();
		}
	}
}
