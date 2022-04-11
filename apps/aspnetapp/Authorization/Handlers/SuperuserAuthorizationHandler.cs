using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Zukte.Authorization.Handlers;
/// <summary>
/// Authorization handler for superusers.
/// </summary>
public class SuperuserAuthorizationHandler : IAuthorizationHandler
{
  private static readonly string[] superusers = {
      "112088567581740211952"
    };

  public Task HandleAsync(AuthorizationHandlerContext context)
  {
    IEnumerable<Claim> claims = context.User.FindAll(e => e.Type == ClaimTypes.NameIdentifier);

    if (claims.Any(claim => superusers.Contains(claim.Value)))
    {
      foreach (IAuthorizationRequirement req in context.Requirements)
      {
        context.Succeed(req);
      }
    }

    return Task.CompletedTask;
  }
}

