using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Zukte.Authorization.Handlers {
	public class SuperuserAuthorizationHandler : IAuthorizationHandler {
		private static readonly string[] superusers = {
	  "112088567581740211952"
	};

		public Task HandleAsync(AuthorizationHandlerContext context) {
			IEnumerable<Claim> idCollection = context.User.FindAll(e => e.Type == ClaimTypes.NameIdentifier);

			foreach (Claim id in idCollection) {
				if (superusers.Contains(id.Value)) {
					foreach (IAuthorizationRequirement req in context.Requirements) {
						context.Succeed(req);
					}
				}
			}

			return Task.CompletedTask;
		}
	}
}
