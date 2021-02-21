using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Zukte.Message.Image;
using Zukte.Utilities;
using Zukte.Utilities.File;

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

			int? pageSizeHint = PageSizeHint.FromMaxResults(request.MaxResults);
			var page = _imageContainerClient.GetBlobs()
					.AsPages(request.PageToken, pageSizeHint)
					.First();

			string[] items = page.Values
				.Select(e => _imageContainerClient.Uri.AbsoluteUri + '/' + e.Name)
				.ToArray();

			var res = new ImageListRequest.Types.ImageListResponse();
			res.Urls.AddRange(items);
			res.NextPageToken = page.ContinuationToken ?? string.Empty;
			return res;
		}

		[HttpPost]
		public async Task<ActionResult<ImageInsertRequest.Types.ImageInsertResponse>> Insert([Required] IFormFile file) {
			Uri? imageLocation = null;

			using (var ms = new MemoryStream((int)file.Length)) {
				await file.CopyToAsync(ms);

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
