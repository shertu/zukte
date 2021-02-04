using System;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Zukte.Utilities.Pagination.TokenPagination;

namespace Zukte.Service {
	public class ApplicationUserServiceImpl : ITokenPaginationService<ApplicationUser> {
		private readonly ApplicationDbContext databaseService;

		private readonly IAuthorizationService authorizationService;

		public ApplicationUserServiceImpl(ApplicationDbContext databaseService) {
			this.databaseService = databaseService;
		}

		public int MaxResultsMax => 50;

		public int MaxResultsDefault => 30;

		public override Task<Empty> Delete(ApplicationUserDeleteRequest request, ServerCallContext context) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			IQueryable<ApplicationUser> query = databaseService.ApplicationUsers;
			query = ApplyIdFilter(query, request.Id);

			// AuthorizationResult authorizationResult = await authorizationService.AuthorizeAsync(context.get, user, new DirectoryWriteRequirement());

			// // check user is permitted to delete specified application users
			// foreach (ApplicationUser user in query) {
			// 	if (!authorizationResult.Succeeded) {
			// 		return Forbid();
			// 	}
			// }

			databaseService.ApplicationUsers.RemoveRange(query);
			databaseService.SaveChangesAsync(context.CancellationToken);

			// // sign out if user deleted their own account
			// string? id = User.FindFirstValue(ClaimTypes.NameIdentifier);
			// if (!ApplicationUserExists(id)) {
			// 	await HttpContext.SignOutAsync();
			// }

			var res = new Empty();
			return Task.FromResult(res);
		}

		public override Task<ApplicationUserListRequest.Types.ApplicationUserListResponse> GetList(ApplicationUserListRequest request, ServerCallContext context) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			// if (request.Mine && !User.IsAuthenticated()) {
			// 	return Challenge();
			// }

			IQueryable<ApplicationUser> query = databaseService.ApplicationUsers;
			query = ApplyIdFilter(query, request.Id);
			query = ApplyMineFitler(query, request.Mine, context.GetHttpContext().User);

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
			var res = new ApplicationUserListRequest.Types.ApplicationUserListResponse();
			res.Items.AddRange(items);

			// generate seek pagination tokens
			ApplicationUser? prevPageToken = GeneratePageToken(query, items, true);
			ApplicationUser? nextPageToken = GeneratePageToken(query, items, false);

			if (prevPageToken != null) {
				res.PrevPageToken = EncryptPageToken(prevPageToken);
			}

			if (nextPageToken != null) {
				res.NextPageToken = EncryptPageToken(nextPageToken);
			}

			// return result
			return Task.FromResult(res);
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