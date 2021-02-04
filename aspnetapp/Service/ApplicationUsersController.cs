using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zukte.Database;

namespace Zukte.Service {
	[ApiController]
	[Route("api/[controller]")]
	[Produces("application/json")]
	public class ApplicationUsersController : ControllerBase {
		private readonly ApplicationDbContext databaseService;
		private readonly IAuthorizationService authorizationService;

		public ApplicationUsersController(ApplicationDbContext databaseService, IAuthorizationService authorizationService) {
			this.databaseService = databaseService;
			this.authorizationService = authorizationService;
		}

		private IQueryable<ApplicationUser> ApplyApplicationUserListRequestFilters(IApplicationUserRequestFilter filters) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			IQueryable<ApplicationUser> query = databaseService.ApplicationUsers;

			#region Mine
			if (filters.Mine) {
				IEnumerable<Claim> nameIdentifierClaimCollection = User.FindAll(e => e.Type == ClaimTypes.NameIdentifier);
				ICollection<string> nameIdentifierClaimValueSet = nameIdentifierClaimCollection.Select(claim => claim.Value).ToHashSet();
				query = query.Where(elem => nameIdentifierClaimValueSet.Contains(elem.Id));
			}
			#endregion

			#region Id
			if (!string.IsNullOrEmpty(filters.Id)) {
				string[] idCollection = filters.Id.Split(',');
				query = query.Where(elem => idCollection.Contains(elem.Id));
			}
			#endregion

			return query;
		}

		// GET: api/ApplicationUsers
		[HttpGet]
		public async Task<ActionResult<ApplicationUserListRequest.ApplicationUserListResponse>> GetApplicationUsers([FromQuery] ApplicationUserListRequest request) {
			if (request.Mine && !User.IsAuthenticated()) {
				return Challenge();
			}

			IQueryable<ApplicationUser> filteredQuery = ApplyApplicationUserListRequestFilters(request);

			List<ApplicationUser> items = await filteredQuery
				.OrderBy(keys => keys.Id)
				.Skip(request.Skip).Take(request.Top ?? 30)
				.ToListAsync();

			int? totalResults = null;
			if (request.Count) {
				totalResults = await filteredQuery.CountAsync();
			}

			return new ApplicationUserListRequest.ApplicationUserListResponse {
				Items = items,
				ResultsPerPage = items.Count,
				TotalResults = totalResults,
			};
		}

		// PUT: api/ApplicationUsers/5
		// To protect from overposting attacks, enable the specific properties you want to bind to, for
		// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
		[HttpPut("{id}")]
		[Authorize]
		public async Task<IActionResult> PutApplicationUser(string id, ApplicationUser applicationUser) {
			AuthorizationResult authorizationResult = await authorizationService.AuthorizeAsync(User, applicationUser, new FileWriteRequirement());
			if (!authorizationResult.Succeeded) {
				return Forbid();
			}

			if (id != applicationUser.Id) {
				return BadRequest();
			}

			databaseService.Entry(applicationUser).State = EntityState.Modified;

			try {
				await databaseService.SaveChangesAsync();
			} catch (DbUpdateConcurrencyException) {
				if (!ApplicationUserExists(id)) {
					return NotFound();
				} else {
					throw;
				}
			}

			return NoContent();
		}

		// DELETE: api/ApplicationUsers
		[HttpDelete]
		[Authorize]
		public async Task<ActionResult<ApplicationUserDeleteRequest.ApplicationUserDeleteResponse>> DeleteApplicationUser([FromQuery] ApplicationUserDeleteRequest request) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			var items = ApplyApplicationUserListRequestFilters(request);

			// check user is permitted to delete specified application users
			foreach (var applicationUser in items) {
				AuthorizationResult authorizationResult = await authorizationService.AuthorizeAsync(User, applicationUser, new DirectoryWriteRequirement());
				if (!authorizationResult.Succeeded) {
					return Forbid();
				}
			}

			databaseService.ApplicationUsers.RemoveRange(items);
			await databaseService.SaveChangesAsync();

			// sign out if user deleted their own account
			string? id = User.FindFirstValue(ClaimTypes.NameIdentifier);
			if (!ApplicationUserExists(id)) {
				await HttpContext.SignOutAsync();
			}

			return new ApplicationUserDeleteRequest.ApplicationUserDeleteResponse {
				Items = await items.ToListAsync(),
			};
		}

		private bool ApplicationUserExists(string id) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			return databaseService.ApplicationUsers.Any(e => e.Id == id);
		}
	}
}
