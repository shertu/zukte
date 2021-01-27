using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using zukte.Models;

namespace zukte.Utilities {
	public static class ApplicationUserExtensions {
		// assume Google is the only identity issuer in the claims principle
		public const string GoogleClaimIssuer = "https://accounts.google.com";
		public const string GoogleNameClaimType = "name";
		public const string GooglePictureClaimType = "picture";
		private const int ExpectedNameIdentifierClaimCount = 1;

		public static ApplicationUser CreateApplicationUserFromIdentity(ClaimsPrincipal principal) {
			Claim[] idCollection = principal.FindAll(c => c.Type == ClaimTypes.NameIdentifier).ToArray();
			int idCount = idCollection.Length;

			if (idCount != ExpectedNameIdentifierClaimCount)
				throw new Exception(
					$"found {idCount} name identifier claims; expected {ExpectedNameIdentifierClaimCount}");

			ApplicationUser applicationUser = new ApplicationUser {
				Id = idCollection.First().Value,
				Name = principal.FindFirstValue(GoogleNameClaimType),
				AvatarUrl = principal.FindFirstValue(GooglePictureClaimType),
			};

			return applicationUser;
		}
	}
}