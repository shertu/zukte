using System.Security.Claims;
using zukte.Models;

namespace zukte.Utilities {
	// There is a reasonable assumption that Google is the only identity issuer in the claims principle.
	public static class ApplicationUserFromClaims {
		//public const string GoogleClaimIssuer = "https://accounts.google.com";
		public const string GoogleNameClaimType = "name";
		public const string GooglePictureClaimType = "picture";


		public static ApplicationUser CreateApplicationUserFromGoogleIdentity(ClaimsPrincipal principal) {
			string id = principal.FindGoogleNameIdentifier();

			ApplicationUser applicationUser = new ApplicationUser {
				Id = id,
				Name = principal.FindFirstValue(GoogleNameClaimType),
				AvatarUrl = principal.FindFirstValue(GooglePictureClaimType),
			};

			return applicationUser;
		}

		public static string FindGoogleNameIdentifier(this ClaimsPrincipal principal) {
			Claim? claim = principal.FindFirst(c => c.Type == ClaimTypes.NameIdentifier);

			if (claim == null) {
				bool isAuthenticated = principal.Identity?.IsAuthenticated ?? false;
				throw new System.ArgumentNullException(
					$"failed to find a name identifier claim; authentication status: {isAuthenticated}");
			} else {
				return claim.Value;
			}
		}
	}
}