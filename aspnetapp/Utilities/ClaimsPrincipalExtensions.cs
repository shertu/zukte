using System.Security.Claims;
using Zukte.Message.ApplicationUser;

namespace Zukte.Utilities {
	public static class ClaimsPrincipalExtensions {
		// assume Google is the only identity issuer in the claims principle
		public const string GoogleClaimIssuer = "https://accounts.google.com";
		public const string GoogleNameClaimType = "name";
		public const string GooglePictureClaimType = "picture";

		public static ApplicationUser CreateApplicationUser(this ClaimsPrincipal principal) {
			string? firstNameIdentifier = principal.FindFirstValue(ClaimTypes.NameIdentifier);

			ApplicationUser applicationUser = new ApplicationUser {
				Name = principal.FindFirstValue(GoogleNameClaimType),
				Picture = principal.FindFirstValue(GooglePictureClaimType),
			};

			if (firstNameIdentifier != null) {
				applicationUser.Id = firstNameIdentifier;
			}

			return applicationUser;
		}

		public static bool IsAuthenticated(this ClaimsPrincipal principal) {
			return principal.Identity?.IsAuthenticated ?? false;
		}
	}
}