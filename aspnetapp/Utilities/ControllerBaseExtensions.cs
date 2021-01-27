using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace zukte.Utilities {
	public static class ControllerBaseExtensions {
		public static ChallengeResult ChallengeToCurrentRequest(this ControllerBase controller) {
			var authenticationProperties = new AuthenticationProperties {
				RedirectUri = controller.Request.Path + controller.Request.QueryString,
			};

			return controller.Challenge(authenticationProperties);
		}


		public static ForbidResult ForbidToCurrentRequest(this ControllerBase controller) {
			var authenticationProperties = new AuthenticationProperties {
				RedirectUri = controller.Request.Path + controller.Request.QueryString,
			};

			return controller.Forbid(authenticationProperties);
		}
	}
}