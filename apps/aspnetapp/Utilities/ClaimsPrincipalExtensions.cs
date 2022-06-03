using System.Security.Claims;

namespace Zukte.Utilities;

public static class ClaimsPrincipalExtensions
{
  // assume Google is the only identity issuer in the claims principle
  public const string GoogleClaimIssuer = "https://accounts.google.com";
  public const string GoogleNameClaimType = "name";
  public const string GooglePictureClaimType = "picture";

  /// <summary>
  /// Creates an <see cref="ApplicationUser"/> instance from the information in the <see cref="ClaimsPrincipal"/>.
  /// </summary>
  public static ApplicationUser CreateApplicationUser(this ClaimsPrincipal principal)
  {
    string? id = principal.FindFirstValue(ClaimTypes.NameIdentifier);

    if (id == null)
    {
      throw new ArgumentNullException(nameof(id),
      "no reasonable id value was found in the claims indentities");
    }

    ApplicationUser applicationUser = new ApplicationUser
    {
      Id = id,
      Name = principal.FindFirstValue(GoogleNameClaimType),
      Picture = principal.FindFirstValue(GooglePictureClaimType),
    };

    return applicationUser;
  }

  /// <summary>
  /// A shorthand method to check if the <see cref="ClaimsPrincipal"/> has an authenticated identity.
  /// </summary>
  public static bool HasAuthenticatedIdentity(this ClaimsPrincipal principal)
  {
    return principal.Identity!.IsAuthenticated;
  }
}
