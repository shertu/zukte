using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using zukte.com.Models;
using zukte.com.Utilities;

namespace zukte.Authorization.Handlers {
	public class ApplicationUserOwnerAuthorizationHandler : AuthorizationHandler<IAuthorizationRequirement, ApplicationUser> {
		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IAuthorizationRequirement requirement, ApplicationUser resource) {
			Claim? id = context.User.FindGoogleNameIdentifier();

			if (id == null) {
				return Task.CompletedTask;
			}

			if (id.Value == resource.Id) {
				context.Succeed(requirement);
			}

			return Task.CompletedTask;
		}
	}
}
