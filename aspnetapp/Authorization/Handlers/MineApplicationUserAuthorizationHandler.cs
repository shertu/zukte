using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Zukte.Entity;

namespace Zukte.Authorization.Handlers {
	/// <summary>
	/// Authorization handler for ownership of accounts.
	/// </summary>
	public class MineApplicationUserAuthorizationHandler : AuthorizationHandler<IAuthorizationRequirement, ApplicationUser> {
		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IAuthorizationRequirement requirement, ApplicationUser resource) {
			IEnumerable<Claim> idCollection = context.User.FindAll(e => e.Type == ClaimTypes.NameIdentifier);

			foreach (Claim id in idCollection) {
				if (id.Value == resource.Id) {
					context.Succeed(requirement);
				}
			}

			return Task.CompletedTask;
		}
	}
}
