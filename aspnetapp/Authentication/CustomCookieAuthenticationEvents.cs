using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using zukte.Controllers;
using zukte.Database;
using zukte.Models;
using zukte.Utilities;

namespace zukte.Authentication {
	// https://github.com/aspnet/Security/blob/master/src/Microsoft.AspNetCore.Authentication.Cookies/Events/CookieAuthenticationEvents.cs
	public class CustomCookieAuthenticationEvents : CookieAuthenticationEvents {
		public ApplicationDbContext? databaseService;

		public override Task RedirectToAccessDenied(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.Headers["Location"] = context.RedirectUri;
			context.Response.StatusCode = 403;
			return Task.CompletedTask;
		}

		public override Task RedirectToLogin(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.Headers["Location"] = context.RedirectUri;
			context.Response.StatusCode = 401;
			return Task.CompletedTask;
		}

		public override Task RedirectToLogout(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.Headers["Location"] = context.RedirectUri;
			return Task.CompletedTask;
		}

		public override Task RedirectToReturnUrl(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.Headers["Location"] = context.RedirectUri;
			return Task.CompletedTask;
		}

		public override Task SignedIn(CookieSignedInContext context) {
			ClaimsPrincipal principal = context.Principal ??
				throw new ArgumentNullException(nameof(principal));

			if (databaseService != null) {
				// https://docs.microsoft.com/en-us/dotnet/standard/parallel-programming/exception-handling-task-parallel-library
				try {
					ApplicationUser applicationUser = ApplicationUserExtensions.CreateApplicationUserFromIdentity(principal);
					var postApplicationUserTask = ApplicationUsersController.PostApplicationUser(applicationUser, databaseService);
					postApplicationUserTask.Wait();
				} catch (AggregateException ae) {
					foreach (var e in ae.InnerExceptions) {
						// Handle the custom exception.
						if (e is ApplicationUsersController.PostApplicationUserConflictException) {
							//Console.WriteLine(e.Message);
						} else {
							throw e;
						}
					}
				}
			}

			return base.SignedIn(context);
		}

		public override Task SigningIn(CookieSigningInContext context) {
			return base.SigningIn(context);
		}

		public override Task SigningOut(CookieSigningOutContext context) {
			return base.SigningOut(context);
		}

		public override Task ValidatePrincipal(CookieValidatePrincipalContext context) {
			return base.ValidatePrincipal(context);
		}
	}
}
