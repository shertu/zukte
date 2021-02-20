using System;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

		public int MaxResultsMax => 50;

		public int MaxResultsDefault => 30;

		[HttpDelete, Authorize]
		public async Task<IActionResult> Delete([FromQuery] ApplicationUserDeleteRequest request) {
			if (_dbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(_dbContext.ApplicationUsers));

			// filter
			IQueryable<ApplicationUser> query = _dbContext.ApplicationUsers;
			query = ApplyIdFilter(query, false, request.Id);

			// authorization
			foreach (ApplicationUser user in query) {
				AuthorizationResult auth = await _authorization.AuthorizeAsync(HttpContext.User, user, new Authorization.Requirements.DirectoryWriteRequirement());
				if (!auth.Succeeded) {
					return Forbid();
				}
			}

			// execute
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
		public ActionResult<ApplicationUserListRequest.Types.ApplicationUserListResponse> GetList([FromQuery] ApplicationUserListRequest request) {
			if (_dbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(_dbContext.ApplicationUsers));

			#region authentication
			if (request.Mine && !User.HasAuthenticatedIdentity()) {
				return Challenge(); // issue a default challenge
			}
			#endregion

			// filter
			IQueryable<ApplicationUser> query = _dbContext.ApplicationUsers;
			query = ApplyIdFilter(query, true, request.Id);
			query = ApplyMineFitler(query, request.Mine, HttpContext.User);

			// apply seek pagination
			ApplicationUser? decryptedPageToken = DecryptPageToken(request.PageToken);
			query = ApplyPageToken(query, decryptedPageToken);

			// execute
			ApplicationUser[] items = ApplyMaxResults(query, (int)request.MaxResults).ToArray();
			var res = new ApplicationUserListRequest.Types.ApplicationUserListResponse();
			res.Items.AddRange(items);

			// next page token
			ApplicationUser? nextPageToken = GenerateNextPageToken(query, items);
			res.NextPageToken = EncryptPageToken(nextPageToken) ?? string.Empty;

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
		public ApplicationUser? DecryptPageToken(string? ciphertext) {
			if (string.IsNullOrEmpty(ciphertext))
				return null;

			// TODO replace with more standard encryption approach
			return JsonSerializer.Deserialize<ApplicationUser>(ciphertext) ??
				throw new SerializationException();
		}

		[NonAction]
		public string? EncryptPageToken(ApplicationUser? value) {
			if (value == null)
				return null;

			// TODO replace with more standard encryption approach
			return JsonSerializer.Serialize(value);
		}

		[NonAction]
		public IQueryable<ApplicationUser> ApplyPageToken(IQueryable<ApplicationUser> query, ApplicationUser? pageToken) {
			if (pageToken != null) {
				string compareToValue = pageToken.Id;
				query = query.Where(user => (user.Id).CompareTo(compareToValue) > 0);
			}

			return ApplyOrderTransform(query);
		}

		[NonAction]
		public ApplicationUser? GenerateNextPageToken(IQueryable<ApplicationUser> query, ApplicationUser[] items) {
			ApplicationUser? pageToken = null;

			if (items.Length > 0) {
				ApplicationUser itemsSelection;
				ApplicationUser querySelection;

				itemsSelection = items.Last();
				querySelection = query.Last();

				var itemsSelectionValue = itemsSelection.Id;
				var querySelectionValue = querySelection.Id;
				int comparison = itemsSelectionValue.CompareTo(querySelectionValue);

				if (comparison < 0) {
					pageToken = itemsSelection;
				}
			}

			return pageToken;
		}

		[NonAction]
		public IQueryable<ApplicationUser> ApplyMaxResults(IQueryable<ApplicationUser> query) {
			return ApplyMaxResults(query, MaxResultsDefault);
		}

		[NonAction]
		public IQueryable<ApplicationUser> ApplyMaxResults(IQueryable<ApplicationUser> query, int top) {
			if (top == 0) {
				top = MaxResultsDefault;
			}

			if (top > MaxResultsMax) {
				top = MaxResultsMax;
			}

			return query.Take(top);
		}

		[NonAction]
		public IQueryable<ApplicationUser> ApplyOrderTransform(IQueryable<ApplicationUser> query) {
			return query.OrderBy(user => user.Id);
		}
	}
}
