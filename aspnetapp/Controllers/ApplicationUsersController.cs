using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
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
	public partial class ApplicationUsersController : ControllerBase {
		private readonly ApplicationDbContext databaseService;
		private readonly IAuthorizationService authorizationService;

		public ApplicationUsersController(ApplicationDbContext databaseService, IAuthorizationService authorizationService) {
			this.databaseService = databaseService;
			this.authorizationService = authorizationService;
		}

		// GET: api/ApplicationUsers
		[HttpGet]
		public async Task<ActionResult<ModelListResponse<ApplicationUser>>> GetApplicationUsers([FromQuery] ApplicationUserListRequest listRequest) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			IQueryable<ApplicationUser> qWhere = databaseService.ApplicationUsers;

			#region ApplicationUserListRequest.Mine
			if (listRequest.Mine) {
				// check user is authenticated
				bool isAuthenticated = User.Identity?.IsAuthenticated ?? false;

				if (!isAuthenticated) {
					AuthenticationProperties authenticationProperties = new AuthenticationProperties {
						RedirectUri = Request.Path + Request.QueryString,
					};

					return Challenge(authenticationProperties);
				}

				// perform filter
				string[] idCollection = User
				.FindAll(claim => claim.Type == ClaimTypes.NameIdentifier)
				.Select(claim => claim.Value).ToArray();

				qWhere = qWhere.Where(elem => idCollection.Contains(elem.Id));
			}
			#endregion

			#region ApplicationUserListRequest.Id
			if (listRequest.Id != null) {
				qWhere = qWhere.Where(elem => listRequest.Id.Contains(elem.Id));
			}
			#endregion

			#region OFFSET and LIMIT
			int skip = listRequest.Skip;
			int take = listRequest.Top ?? 30;
			#endregion

			// Execute
			List<ApplicationUser> items = await qWhere
			.OrderBy(elem => elem.Id)
			.Skip(skip).Take(take)
			.ToListAsync();

			int? qWhereCount = listRequest.Count ? await qWhere.CountAsync() : null;

			return new ModelListResponse<ApplicationUser> {
				Items = items,
				ResultsPerPage = items.Count,
				TotalResults = qWhereCount,
			};
		}

		// // PUT: api/ApplicationUsers/5
		// // To protect from overposting attacks, enable the specific properties you want to bind to, for
		// // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
		// [HttpPut("{id}")]
		// public async Task<IActionResult> PutApplicationUser(string id, ApplicationUser applicationUser) {
		// 	AuthorizationResult authorizationResult = await _authorizationService.AuthorizeAsync(User, applicationUser, new FileWriteRequirement());
		// 	if (!authorizationResult.Succeeded) {
		// 		return Forbid();
		// 	}

		// 	if (id != applicationUser.Id) {
		// 		return BadRequest();
		// 	}

		// 	_context.Entry(applicationUser).State = EntityState.Modified;

		// 	try {
		// 		await _context.SaveChangesAsync();
		// 	} catch (DbUpdateConcurrencyException) {
		// 		if (!ApplicationUserExists(id, _context)) {
		// 			return NotFound();
		// 		} else {
		// 			throw;
		// 		}
		// 	}

		// 	return NoContent();
		// }

		// Account creation should not be available to a publically expose endpoint
		public static async Task<ApplicationUser> PostApplicationUser(ApplicationUser applicationUser, ApplicationDbContext databaseService) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			databaseService.ApplicationUsers.Add(applicationUser);
			try {
				await databaseService.SaveChangesAsync();
			} catch (DbUpdateException) {
				if (ApplicationUserExists(applicationUser.Id, databaseService)) {
					throw new PostApplicationUserConflictException(
						$" an application user with id, {applicationUser.Id}, already exists");
				} else {
					throw;
				}
			}

			return applicationUser;
		}

		// // DELETE: api/ApplicationUsers/5
		// [HttpDelete("{id}")]
		// public async Task<ActionResult<ApplicationUser>> DeleteApplicationUser(string id) {
		// 	var applicationUser = await databaseService.ApplicationUsers.FindAsync(id);

		// 	AuthorizationResult authorizationResult = await authorizationService.AuthorizeAsync(User, applicationUser, new DirectoryWriteRequirement());
		// 	if (!authorizationResult.Succeeded) {
		// 		return Forbid();
		// 	}

		// 	if (applicationUser == null) {
		// 		return NotFound();
		// 	}

		// 	databaseService.ApplicationUsers.Remove(applicationUser);
		// 	await databaseService.SaveChangesAsync();

		// 	// #region Auth SignOut Hook
		// 	// string nameIdentifier = User.FindGoogleNameIdentifierValue();
		// 	// if (nameIdentifier == applicationUser.Id) {
		// 	// 	await HttpContext.SignOutAsync();
		// 	// }
		// 	// #endregion

		// 	return applicationUser;
		// }

		private static bool ApplicationUserExists(string id, ApplicationDbContext applicationDbContext) {
			if (applicationDbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(applicationDbContext.ApplicationUsers));

			return applicationDbContext.ApplicationUsers.Any(e => e.Id == id);
		}
	}
}
