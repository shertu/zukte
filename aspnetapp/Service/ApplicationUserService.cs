using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zukte.Database;
using Zukte.Message.ApplicationUser;
using Zukte.Utilities;
using Zukte.Utilities.Pagination.TokenPagination;

namespace Zukte.Service {
	/// <inheritdoc/>
	[ApiController]
	[Route("api/[controller]")]
	[Produces("application/json")]
	public class ApplicationUserService : ControllerBase, ITokenPaginationService<ApplicationUser> {
		// The database sevice
		private readonly ApplicationDbContext _dbContext;

		// The authorization service
		private readonly IAuthorizationService _authorization;

		public ApplicationUserService(ApplicationDbContext dbContext, IAuthorizationService authorization) {
			_dbContext = dbContext;
			_authorization = authorization;
		}

		public int PageSizeHintMaximum => 50;
		public int PageSizeHintDefault => 30;

		[HttpDelete, Authorize]
		public async Task<IActionResult> Delete([FromQuery] ApplicationUserDeleteRequest request) {
			if (_dbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(_dbContext.ApplicationUsers));

			#region filter
			IQueryable<ApplicationUser> query = _dbContext.ApplicationUsers;
			query = ApplyIdFilter(query, false, request.Id);
			#endregion

			#region authorization
			foreach (ApplicationUser user in query) {
				AuthorizationResult auth = await _authorization.AuthorizeAsync(HttpContext.User, user, new Authorization.Requirements.DirectoryWriteRequirement());
				if (!auth.Succeeded) {
					return Forbid();
				}
			}
			#endregion

			_dbContext.ApplicationUsers.RemoveRange(query);
			await _dbContext.SaveChangesAsync();

			#region sign out if user deleted their own account
			string? id = User.FindFirstValue(ClaimTypes.NameIdentifier);
			ApplicationUser? mine = await _dbContext.ApplicationUsers.FindAsync(id);
			if (mine == null) {
				await HttpContext.SignOutAsync();
			}
			#endregion

			return NoContent();
		}

		[HttpGet]
		public async Task<ActionResult<ApplicationUserListRequest.Types.ApplicationUserListResponse>> GetList([FromQuery] ApplicationUserListRequest request) {
			if (_dbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(_dbContext.ApplicationUsers));

			#region authentication
			if (request.Mine && !User.HasAuthenticatedIdentity()) {
				return Challenge(); // issue a default challenge
			}
			#endregion

			#region filter
			IQueryable<ApplicationUser> query = _dbContext.ApplicationUsers;
			query = ApplyIdFilter(query, true, request.Id);
			query = ApplyMineFitler(query, request.Mine, HttpContext.User);
			#endregion

			int? pageSizeHint = ITokenPaginationServiceExtensions.ToPageSizeHint(request.MaxResults);
			var page = await GetNextPageAsync(query, request.PageToken, pageSizeHint);

			var res = new ApplicationUserListRequest.Types.ApplicationUserListResponse();
			res.Items.AddRange(page.values);
			res.NextPageToken = page.continuationToken ?? string.Empty;
			return res;
		}

		/// <summary>
		/// Applies a filter to select accounts owned by the user.
		/// </summary>
		[NonAction]
		private IQueryable<ApplicationUser> ApplyMineFitler(IQueryable<ApplicationUser> query, bool mineFilter, ClaimsPrincipal principle) {
			if (_dbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(_dbContext.ApplicationUsers));

			if (mineFilter) {
				string[] idCollection = principle.FindAll(claim => claim.Type == ClaimTypes.NameIdentifier)
					.Select(claim => claim.Value)
					.ToArray();

				query = ApplyIdFilter(query, false, idCollection);
			}

			return query;
		}

		/// <summary>
		/// Applies a filter to select accounts with the specified ids.
		/// </summary>
		[NonAction]
		private IQueryable<ApplicationUser> ApplyIdFilter(IQueryable<ApplicationUser> query, bool skipNoFilter, params string[] idFilterArr) {
			// transform ids into standard format first
			string combined = string.Join(',', idFilterArr);
			string[] standard = combined.Split(',')
				.Where(elem => !string.IsNullOrEmpty(elem))
				.ToArray();

			if (standard.Length > 0 || !skipNoFilter) {
				query = query.Where(user => standard.Contains(user.Id));
			}

			return query;
		}

		[NonAction]
		public async ValueTask<Page<ApplicationUser>> GetNextPageAsync(IQueryable<ApplicationUser> postFilterQuery, string continuationToken, int? pageSizeHint) {
			return await GetNextPageAsync(postFilterQuery, continuationToken, pageSizeHint, CancellationToken.None);
		}

		[NonAction]
		public async ValueTask<Page<ApplicationUser>> GetNextPageAsync(IQueryable<ApplicationUser> query, string continuationToken, int? pageSizeHint, CancellationToken cancellationToken) {
			if (!string.IsNullOrEmpty(continuationToken)) {
				ApplicationUser? seeker = FromContinuationToken(continuationToken);
				query = query.Where(user => (user.Id).CompareTo(seeker.Id) > 0);
			}

			var qOrder = query.OrderBy(user => user.Id);

			var items = await this.ApplyPageHintSize(qOrder, pageSizeHint).ToListAsync();
			string? nextContinuationToken = await GenerateNextPageToken(qOrder, items);
			return new Page<ApplicationUser>(items.AsReadOnly(), nextContinuationToken);
		}

		[NonAction]
		public ApplicationUser FromContinuationToken(string continuationToken) {
			return JsonSerializer.Deserialize<ApplicationUser>(continuationToken) ??
				throw new SerializationException();
		}

		[NonAction]
		public async Task<string?> GenerateNextPageToken(IQueryable<ApplicationUser> q, IList<ApplicationUser> qValues) {
			string? continuationToken = null;

			if (qValues.Count > 0) {
				ApplicationUser qValueSelection;
				ApplicationUser qSelection;

				qValueSelection = qValues[qValues.Count - 1];
				qSelection = await q.LastOrDefaultAsync();

				int comparison = (qValueSelection.Id).CompareTo(qSelection.Id);
				if (comparison < 0) {
					continuationToken = JsonSerializer.Serialize(qValueSelection);
				}
			}

			return continuationToken;
		}
	}
}
