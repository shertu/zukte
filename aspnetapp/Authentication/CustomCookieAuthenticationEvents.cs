using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System;
using System.Threading.Tasks;

namespace Zukte.Authentication {
	// https://github.com/aspnet/Security/blob/master/src/Microsoft.AspNetCore.Authentication.Cookies/Events/CookieAuthenticationEvents.cs
	public class CustomCookieAuthenticationEvents : CookieAuthenticationEvents {
		public AccountCreator? accountCreator;

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
			var principal = context.Principal ??
				throw new ArgumentNullException();

			Task def = base.SignedIn(context);

			if (accountCreator == null || !principal.IsAuthenticated()) {
				return def;
			}

			var account = principal.CreateApplicationUserFrom();
			var createAccountTask = accountCreator.PostApplicationUser(account);

			// https://docs.microsoft.com/en-us/dotnet/standard/parallel-programming/exception-handling-task-parallel-library
			try {
				createAccountTask.Wait();
			} catch (AggregateException ae) {
				foreach (var e in ae.InnerExceptions) {
					if (e is AccountCreator.PostApplicationUserConflictException) {
						Console.WriteLine(e.Message);
					} else {
						throw e;
					}
				}
			}

			return def;
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
