using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System;
using System.Threading.Tasks;

namespace zukte.Security.Authentication {
	// https://github.com/aspnet/Security/blob/master/src/Microsoft.AspNetCore.Authentication.Cookies/Events/CookieAuthenticationEvents.cs
	public class CustomCookieAuthenticationEvents : CookieAuthenticationEvents {
		/// <summary>
		/// Implements the interface method by invoking the related delegate method.
		/// </summary>
		/// <param name="context">Contains information about the event</param>
		public override Task RedirectToLogout(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.Headers["Location"] = context.RedirectUri;
			return Task.CompletedTask;
		}

		/// <summary>
		/// Implements the interface method by invoking the related delegate method.
		/// </summary>
		/// <param name="context">Contains information about the event</param>
		public override Task RedirectToLogin(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.Headers["Location"] = context.RedirectUri;
			context.Response.StatusCode = 401;
			return Task.CompletedTask;
		}

		/// <summary>
		/// Implements the interface method by invoking the related delegate method.
		/// </summary>
		/// <param name="context">Contains information about the event</param>
		public override Task RedirectToReturnUrl(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.Headers["Location"] = context.RedirectUri;
			return Task.CompletedTask;
		}

		/// <summary>
		/// Implements the interface method by invoking the related delegate method.
		/// </summary>
		/// <param name="context">Contains information about the event</param>
		public override Task RedirectToAccessDenied(RedirectContext<CookieAuthenticationOptions> context) {
			context.Response.Headers["Location"] = context.RedirectUri;
			context.Response.StatusCode = 403;
			return Task.CompletedTask;
		}
	}
}
