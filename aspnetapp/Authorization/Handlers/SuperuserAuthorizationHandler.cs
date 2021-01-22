using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using zukte.com.Utilities;

namespace zukte.Authorization.Handlers {
	public class SuperuserAuthorizationHandler : IAuthorizationHandler {
		private static readonly string[] superusers = {
	  "112088567581740211952"
	};

		public Task HandleAsync(AuthorizationHandlerContext context) {
			Claim? id = context.User.FindGoogleNameIdentifier();

			if (id == null) {
				return Task.CompletedTask;
			}

			if (superusers.Contains(id.Value)) {
				foreach (IAuthorizationRequirement req in context.Requirements) {
					context.Succeed(req);
				}
			}

			return Task.CompletedTask;
		}
	}
}
