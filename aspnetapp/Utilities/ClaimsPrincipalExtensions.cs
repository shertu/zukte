using System.Security.Claims;
using Zukte.Message.ApplicatonUser;

namespace zukte.Utilities {
	public static class ClaimsPrincipalExtensions {
		// assume Google is the only identity issuer in the claims principle
		public const string GoogleClaimIssuer = "https://accounts.google.com";
		public const string GoogleNameClaimType = "name";
		public const string GooglePictureClaimType = "picture";

		public static ApplicationUser CreateApplicationUserFrom(this ClaimsPrincipal principal) {
			string? nameIdentifier = principal.FindFirstValue(ClaimTypes.NameIdentifier);

			ApplicationUser applicationUser = new ApplicationUser {
				Name = principal.FindFirstValue(GoogleNameClaimType),
				Picture = principal.FindFirstValue(GooglePictureClaimType),
			};

			if (nameIdentifier != null) {
				applicationUser.Id = nameIdentifier;
			}

			return applicationUser;
		}

		public static bool IsAuthenticated(this ClaimsPrincipal principal) {
			return principal.Identity?.IsAuthenticated ?? false;
		}
	}
}