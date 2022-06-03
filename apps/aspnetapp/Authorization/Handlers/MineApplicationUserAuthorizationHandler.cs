using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Zukte.Authorization.Handlers;
/// <summary>
/// Authorization handler for ownership of accounts.
/// </summary>
public class MineApplicationUserAuthorizationHandler : AuthorizationHandler<IAuthorizationRequirement, ApplicationUser>
{
  protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IAuthorizationRequirement requirement, ApplicationUser resource)
  {
    var nameIdentifierClaims = context.User.FindAll(claim => claim.Type == ClaimTypes.NameIdentifier);
    if (nameIdentifierClaims.Any(claim => claim.Value == resource.Id))
    {
      context.Succeed(requirement);
    }
    return Task.CompletedTask;
  }
}

