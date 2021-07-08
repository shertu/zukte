using System;
using System.Security.Claims;
using Zukte.Entity;

namespace Zukte.Utilities {
	public static class ClaimsPrincipalExtensions {
		// assume Google is the only identity issuer in the claims principle
		public const string GoogleClaimIssuer = "https://accounts.google.com";
		public const string GoogleNameClaimType = "name";
		public const string GooglePictureClaimType = "picture";

		/// <summary>
		/// Creates an <see cref="ApplicationUser"/> instance from the user info.
		/// </summary>
		public static ApplicationUser CreateApplicationUser(this ClaimsPrincipal principal) {
			string? firstNameIdentifier = principal.FindFirstValue(ClaimTypes.NameIdentifier);

			ApplicationUser applicationUser = new ApplicationUser {
				Name = principal.FindFirstValue(GoogleNameClaimType),
				Picture = principal.FindFirstValue(GooglePictureClaimType),
			};

			if (firstNameIdentifier == null) {
				throw new ArgumentNullException(nameof(firstNameIdentifier),
				"No reasonable id value was found in the claims indentities.");
			} else {
				applicationUser.Id = firstNameIdentifier;
			}

			return applicationUser;
		}

		/// <summary>
		/// A shorthand method to check if the user is signed in.
		/// </summary>
		public static bool HasAuthenticatedIdentity(this ClaimsPrincipal principal) {
			return principal.Identity?.IsAuthenticated ?? false;
		}
	}
}