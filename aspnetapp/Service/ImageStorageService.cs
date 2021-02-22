using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Zukte.Message.ImageStorage;
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
			_ = _imageContainerClient.SetAccessPolicy(PublicAccessType.BlobContainer);
		}

		[HttpGet]
		public ActionResult<ImageStorageListRequest.ImageStorageListResponse> GetList([FromQuery] ImageStorageListRequest request) {
			var page = _imageContainerClient.GetBlobs()
					.AsPages(request.PageToken, (int?)request.MaxResults)
					.First();

			string[] items = page.Values
				.Select(e => _imageContainerClient.Uri.AbsoluteUri + '/' + e.Name)
				.ToArray();

			var res = new ImageStorageListRequest.ImageStorageListResponse();
			res.Items = items;
			res.NextPageToken = page.ContinuationToken ?? string.Empty;
			return res;
		}

		[HttpPost]
		public async Task<ActionResult<ImageStorageInsertRequest.ImageStorageInsertResponse>> Insert([FromForm] ImageStorageInsertRequest request) {
			Uri? imageLocation = null;

			if (request.Image != null) {
				IFormFile file = request.Image;

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
			}

			var res = new ImageStorageInsertRequest.ImageStorageInsertResponse();
			res.InsertedImageUrl = imageLocation?.AbsoluteUri;
			return res;
		}
	}
}
