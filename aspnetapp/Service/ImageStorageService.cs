using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using Zukte.Message.Image;
using Zukte.Utilities.File;
using Zukte.Utilities.Pagination.TokenPagination;

namespace Zukte.Service {
	/// <inheritdoc/>
	[ApiController]
	[Route("api/blob-storage/[controller]")]
	[Produces("application/json")]
	public class ImageStorageService : ControllerBase {
		private readonly BlobContainerClient _imageContainerClient;

		public ImageStorageService(BlobServiceClient blobServiceClient) {
			_imageContainerClient = blobServiceClient.GetBlobContainerClient("image-service");
			_ = _imageContainerClient.CreateIfNotExists();
		}

		[HttpGet]
		public ActionResult<ImageListRequest.Types.ImageListResponse> GetList([FromQuery] ImageListRequest request) {
			uint max = request.MaxResults;

			int? pageSizeHint = ITokenPaginationServiceExtensions.ToPageSizeHint(request.MaxResults);
			var page = _imageContainerClient.GetBlobs()
					.AsPages(request.PageToken, pageSizeHint)
					.First();

			string[] items = page.Values
				.Select(e => _imageContainerClient.Uri.AbsoluteUri + '/' + e.Name)
				.ToArray();

			var res = new ImageListRequest.Types.ImageListResponse();
			res.Urls.AddRange(items);
			res.NextPageToken = page.ContinuationToken;
			return res;
		}

		// public async Task<ActionResult<string>> UploadImage([Required] IFormFile file) {
		[HttpPost]
		public async Task<ActionResult<ImageInsertRequest.Types.ImageInsertResponse>> Insert([FromQuery] ImageInsertRequest request) {
			Uri? imageLocation = null;

			var buffer = request.ImageData.ToByteArray();
			using (var ms = new MemoryStream(buffer)) {
				string filepath = Guid.NewGuid().ToString();

				if (Upload.IsActualImageFile(ms)) {
					imageLocation = await Upload.UploadFileToBlobContainer(ModelState, _imageContainerClient, filepath, ms);
				} else {
					ModelState.AddModelError(filepath,
					  $"The file {filepath} is an invalid image file.");
				}
			}

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			if (imageLocation == null) {
				throw new ArgumentNullException(nameof(imageLocation));
			}

			var res = new ImageInsertRequest.Types.ImageInsertResponse();
			res.Url = imageLocation.AbsoluteUri;
			return res;
		}
	}
}
