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
	[ApiController]
	[Route("api/[controller]")]
	[Produces("application/json")]
	public class ApplicationUserService : ControllerBase, ITokenPaginationService<ApplicationUser> {
		private readonly ApplicationDbContext databaseService;
		private readonly IAuthorizationService authorizationService;

		public ApplicationUserService(ApplicationDbContext databaseService, IAuthorizationService authorizationService) {
			this.databaseService = databaseService;
			this.authorizationService = authorizationService;
		}

		public int MaxResultsMax => 50;

		public int MaxResultsDefault => 30;

		[HttpDelete, Authorize]
		public async Task<IActionResult> Delete([FromQuery] ApplicationUserDeleteRequest request) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			IQueryable<ApplicationUser> query = databaseService.ApplicationUsers;
			query = ApplyIdFilter(query, request.Id);

			// check user is permitted to delete specified application users
			foreach (ApplicationUser user in query) {
				AuthorizationResult auth = await authorizationService.AuthorizeAsync(HttpContext.User, user, new Authorization.Requirements.DirectoryWriteRequirement());
				if (!auth.Succeeded) {
					return Forbid();
				}
			}

			databaseService.ApplicationUsers.RemoveRange(query);
			await databaseService.SaveChangesAsync();

			// sign out if user deleted their own account
			string? id = User.FindFirstValue(ClaimTypes.NameIdentifier);
			ApplicationUser? mine = await databaseService.ApplicationUsers.FindAsync(id);
			if (mine == null) {
				await HttpContext.SignOutAsync();
			}

			return NoContent();
		}

		public ActionResult<ApplicationUserListRequest.ApplicationUserListResponse> GetList([FromQuery] ApplicationUserListRequest request) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			// authorization check
			if (request.Mine && !User.IsAuthenticated()) {
				// issue a default challenge
				return Challenge();
			}

			IQueryable<ApplicationUser> query = databaseService.ApplicationUsers;
			query = ApplyIdFilter(query, request.Id);
			query = ApplyMineFitler(query, request.Mine, HttpContext.User);

			// apply seek pagination
			ApplicationUser? pageTokenDecrypted;
			if (string.IsNullOrEmpty(request.PageToken)) {
				pageTokenDecrypted = null;
			} else {
				pageTokenDecrypted = DecryptPageToken(request.PageToken);
			}

			query = ApplyPageToken(query, pageTokenDecrypted);

			// fetch maximum number of results
			ApplicationUser[] items = ApplyMaxResults(query, (int)request.MaxResults).ToArray();
			var res = new ApplicationUserListRequest.ApplicationUserListResponse();
			res.Items = items;

			// generate seek pagination tokens
			ApplicationUser? prevPageToken = GeneratePageToken(query, items, true);
			ApplicationUser? nextPageToken = GeneratePageToken(query, items, false);

			if (prevPageToken != null) {
				res.PrevPageToken = EncryptPageToken(prevPageToken) ?? string.Empty;
			}

			if (nextPageToken != null) {
				res.NextPageToken = EncryptPageToken(nextPageToken) ?? string.Empty;
			}

			// return result
			return res;
		}

		private IQueryable<ApplicationUser> ApplyMineFitler(IQueryable<ApplicationUser> query, bool mineFilter, ClaimsPrincipal principle) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			if (mineFilter) {
				string[] idCollection = principle.FindAll(claim => claim.Type == ClaimTypes.NameIdentifier)
					.Select(claim => claim.Value)
					.ToArray();

				query = ApplyIdFilter(query, idCollection);
			}

			return query;
		}

		private IQueryable<ApplicationUser> ApplyIdFilter(IQueryable<ApplicationUser> query, params string[] idFilter) {
			foreach (var item in idFilter) {
				string[] idCollection = item.Split(',');
				query = query.Where(user => idCollection.Contains(user.Id));
			}

			return query;
		}

		public ApplicationUser? DecryptPageToken(string? ciphertext) {
			if (string.IsNullOrEmpty(ciphertext))
				return null;

			// TODO replace with more standard encryption approach
			return JsonSerializer.Deserialize<ApplicationUser>(ciphertext) ??
				throw new SerializationException();
		}

		public string? EncryptPageToken(ApplicationUser? value) {
			if (value == null)
				return null;

			// TODO replace with more standard encryption approach
			return JsonSerializer.Serialize(value);
		}

		public IQueryable<ApplicationUser> ApplyPageToken(IQueryable<ApplicationUser> query, ApplicationUser? pageToken) {
			if (pageToken == null)
				return query;

			var idKeyCompareValue = SelectKeyFromPageToken(pageToken);

			// current support ascend order only
			query = query.Where(user => SelectKeyFromPageToken(user).CompareTo(idKeyCompareValue) > 0);

			return query;
		}

		public IComparable SelectKeyFromPageToken(ApplicationUser pageToken) {
			return pageToken.Id;
		}

		public ApplicationUser? GeneratePageToken(IQueryable<ApplicationUser> query, ApplicationUser[] items, bool prevToken) {
			ApplicationUser? pageToken = null;

			if (items.Length > 0) {
				ApplicationUser itemsSelection;
				ApplicationUser querySelection;

				if (prevToken) {
					itemsSelection = items.First();
					querySelection = query.First();
				} else {
					itemsSelection = items.Last();
					querySelection = query.Last();
				}

				var itemsSelectionValue = SelectKeyFromPageToken(itemsSelection);
				var querySelectionValue = SelectKeyFromPageToken(querySelection);
				int comparison = itemsSelectionValue.CompareTo(querySelectionValue);

				if ((prevToken && comparison > 0) || (!prevToken && comparison < 0)) {
					pageToken = itemsSelection;
				}
			}

			return pageToken;
		}

		public IQueryable<ApplicationUser> ApplyMaxResults(IQueryable<ApplicationUser> query) {
			return ApplyMaxResults(query, MaxResultsDefault);
		}

		public IQueryable<ApplicationUser> ApplyMaxResults(IQueryable<ApplicationUser> query, int top) {
			if (top == 0) {
				top = MaxResultsDefault;
			}

			if (top > MaxResultsMax) {
				top = MaxResultsMax;
			}

			return query.Take(top);
		}

		public IQueryable<ApplicationUser> ApplyOrderTransform(IQueryable<ApplicationUser> query) {
			return ApplyOrderTransform(query, SelectKeyFromPageToken);
		}

		public IQueryable<ApplicationUser> ApplyOrderTransform(IQueryable<ApplicationUser> query, Func<ApplicationUser, IComparable> transform) {
			return query.OrderBy(user => transform(user));
		}

		public IQueryable<ApplicationUser> ApplySkipTransform(IQueryable<ApplicationUser> query, int skip) {
			throw new NotImplementedException();
		}
	}
}