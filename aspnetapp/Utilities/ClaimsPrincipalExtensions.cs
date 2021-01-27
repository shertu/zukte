using System.Security.Claims;
using zukte.Models;

namespace zukte.Utilities {
	public static class ClaimsPrincipalExtensions {
		// assume Google is the only identity issuer in the claims principle
		public const string GoogleClaimIssuer = "https://accounts.google.com";
		public const string GoogleNameClaimType = "name";
		public const string GooglePictureClaimType = "picture";

		public static ApplicationUser CreateApplicationUserFrom(this ClaimsPrincipal principal) {
			string? id = principal.FindFirstValue(ClaimTypes.NameIdentifier);

			ApplicationUser applicationUser = new ApplicationUser {
				Name = principal.FindFirstValue(GoogleNameClaimType),
				AvatarUrl = principal.FindFirstValue(GooglePictureClaimType),
			};

			if (id != null) {
				applicationUser.Id = id;
			}

			return applicationUser;
		}

		public static bool IsAuthenticated(this ClaimsPrincipal principal) {
			return principal.Identity?.IsAuthenticated ?? false;
		}
	}
}