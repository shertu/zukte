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
	[Route("api/blob-storage/[controller]")]
	[Produces("application/json")]
	public class ImageService : ControllerBase, ITokenPaginationService<string> {
		private readonly ApplicationDbContext _dbContext;

		private readonly IAuthorizationService _authorization;

		public ApplicationUserService(ApplicationDbContext dbContext, IAuthorizationService authorization) {
			_dbContext = dbContext;
			_authorization = authorization;
		}

		public int MaxResultsMax => 50;

		public int MaxResultsDefault => 30;

		/// <summary>
		/// Gets a list of accounts in the system.
		/// </summary>
		[HttpGet]
		public ActionResult<ApplicationUserListRequest.Types.ApplicationUserListResponse> GetList([FromQuery] ApplicationUserListRequest request) {
			if (_dbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(_dbContext.ApplicationUsers));

			// the MINE version of this endpoint requires an authorization check
			if (request.Mine && !User.IsAuthenticated()) {
				return Challenge(); // issue a default challenge
			}

			IQueryable<ApplicationUser> query = _dbContext.ApplicationUsers;
			query = ApplyIdFilter(query, true, request.Id);
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
			var res = new ApplicationUserListRequest.Types.ApplicationUserListResponse();
			res.Items.AddRange(items);

			#region generate seek pagination tokens
			ApplicationUser? nextPageToken = GeneratePageToken(query, items, false);
			if (nextPageToken != null) {
				res.NextPageToken = EncryptPageToken(nextPageToken) ?? string.Empty;
			}
			#endregion

			// return result
			return res;
		}
	}

	public class BlobStorageController : ControllerBase {
		private readonly BlobServiceClient _blobServiceClient;

		public BlobStorageController(BlobServiceClient blobServiceClient) {
			_blobServiceClient = blobServiceClient;
		}

		private async Task<BlobContainerClient> GetImageShareContainer() {
			BlobContainerClient container = _blobServiceClient.GetBlobContainerClient("image-share");
			_ = await container.CreateIfNotExistsAsync();
			return container;
		}

		// GET: api/ImageShare
		[HttpGet("List")]
		public async Task<ActionResult<ListResponse<string>>> ListImages([Required, FromQuery] ListRequest request) {
			BlobContainerClient container = await GetImageShareContainer();

			int? pageSizeHint = (int?)request.MaxResults;

			Page<BlobItem> page = container.GetBlobs()
			  .AsPages(request.PageToken, pageSizeHint)
			  .First();

			string[] items = page.Values
			  .Select(e => container.Uri.AbsoluteUri + '/' + e.Name)
			  .ToArray();

			ListResponse<string> response = new ListResponse<string> {
				Items = items,
				NextPageToken = page.ContinuationToken ?? string.Empty,
			};

			return response;
		}

		// POST: api/ImageShare
		[HttpPost]
		// public async Task<ActionResult<string>> UploadImage([Required, OpenApiEncodingContentType("image/*")] IFormFile file) {
		public async Task<ActionResult<string>> UploadImage([Required] IFormFile file) {
			BlobContainerClient containerClient = await GetImageShareContainer();

			if (containerClient == null) {
				throw new ArgumentNullException();
			}

			Uri uri = await file.ProcessImageFile(ModelState, string.Empty, containerClient);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			string absoluteUri = uri == null ? string.Empty : uri.AbsoluteUri;
			return new ActionResult<string>(absoluteUri);
		}
	}
}
