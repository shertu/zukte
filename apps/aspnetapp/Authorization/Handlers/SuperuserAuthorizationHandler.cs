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
    var ids = context.User.FindAll(claim => claim.Type == ClaimTypes.NameIdentifier).Select(claim => claim.Value);
    if (ids.Any(id => superusers.Contains(id)))
    {
      foreach (IAuthorizationRequirement requirement in context.Requirements)
      {
        context.Succeed(requirement);
      }
    }
    return Task.CompletedTask;
  }
}

