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
    IEnumerable<Claim> claims = context.User.FindAll(e => e.Type == ClaimTypes.NameIdentifier);
    if (claims.Any(claim => claim.Value == resource.Id))
    {
      context.Succeed(requirement);
    }
    return Task.CompletedTask;
  }
}

