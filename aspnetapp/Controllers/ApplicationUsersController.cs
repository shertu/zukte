using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using zukte.Authorization.Requirements;
using zukte.Database;
using zukte.Models;

namespace zukte.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	[Produces("application/json")]
	public class ApplicationUsersController : ControllerBase {
		[System.Serializable]
		public class PostApplicationUserConflictException : System.Exception {
			public PostApplicationUserConflictException() { }
			public PostApplicationUserConflictException(string message) : base(message) { }
			public PostApplicationUserConflictException(string message, System.Exception inner) : base(message, inner) { }
			protected PostApplicationUserConflictException(
				System.Runtime.Serialization.SerializationInfo info,
				System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
		}

		private readonly ApplicationDbContext _context;
		private readonly IAuthorizationService _authorizationService;

		public ApplicationUsersController(ApplicationDbContext context, IAuthorizationService authorizationService) {
			_context = context;
			_authorizationService = authorizationService;
		}

		// GET: api/ApplicationUsers
		[HttpGet]
		public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetApplicationUsers() {
			return await _context.ApplicationUsers.ToListAsync();
		}

		// GET: api/ApplicationUsers/5
		[HttpGet("{id}")]
		public async Task<ActionResult<ApplicationUser>> GetApplicationUser(string id) {
			// if (_context.ApplicationUsers == null) {
			// 	throw new ArgumentNullException();
			// }

			var applicationUser = await _context.ApplicationUsers.FindAsync(id);

			if (applicationUser == null) {
				return NotFound();
			}

			return applicationUser;
		}

		// PUT: api/ApplicationUsers/5
		// To protect from overposting attacks, enable the specific properties you want to bind to, for
		// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
		[HttpPut("{id}")]
		public async Task<IActionResult> PutApplicationUser(string id, ApplicationUser applicationUser) {
			AuthorizationResult authorizationResult = await _authorizationService.AuthorizeAsync(User, applicationUser, new FileWriteRequirement());
			if (!authorizationResult.Succeeded) {
				return Forbid();
			}

			if (id != applicationUser.Id) {
				return BadRequest();
			}

			_context.Entry(applicationUser).State = EntityState.Modified;

			try {
				await _context.SaveChangesAsync();
			} catch (DbUpdateConcurrencyException) {
				if (!ApplicationUserExists(id, _context)) {
					return NotFound();
				} else {
					throw;
				}
			}

			return NoContent();
		}

		// Account creation should not be available to a publically expose endpoint
		public static async Task<ApplicationUser> PostApplicationUser(ApplicationUser applicationUser, ApplicationDbContext applicationDbContext) {
			if (applicationDbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(applicationDbContext.ApplicationUsers));

			applicationDbContext.ApplicationUsers.Add(applicationUser);
			try {
				await applicationDbContext.SaveChangesAsync();
			} catch (DbUpdateException) {
				if (ApplicationUserExists(applicationUser.Id, applicationDbContext)) {
					throw new PostApplicationUserConflictException(
						$" an application user with id, {applicationUser.Id}, already exists");
				} else {
					throw;
				}
			}

			return applicationUser;
		}

		// DELETE: api/ApplicationUsers/5
		[HttpDelete("{id}")]
		public async Task<ActionResult<ApplicationUser>> DeleteApplicationUser(string id) {
			var applicationUser = await _context.ApplicationUsers.FindAsync(id);

			AuthorizationResult authorizationResult = await _authorizationService.AuthorizeAsync(User, applicationUser, new DirectoryWriteRequirement());
			if (!authorizationResult.Succeeded) {
				return Forbid();
			}

			if (applicationUser == null) {
				return NotFound();
			}

			_context.ApplicationUsers.Remove(applicationUser);
			await _context.SaveChangesAsync();

			// #region Auth SignOut Hook
			// string nameIdentifier = User.FindGoogleNameIdentifierValue();
			// if (nameIdentifier == applicationUser.Id) {
			// 	await HttpContext.SignOutAsync();
			// }
			// #endregion

			return applicationUser;
		}

		private static bool ApplicationUserExists(string id, ApplicationDbContext applicationDbContext) {
			if (applicationDbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(applicationDbContext.ApplicationUsers));

			return applicationDbContext.ApplicationUsers.Any(e => e.Id == id);
		}
	}
}
