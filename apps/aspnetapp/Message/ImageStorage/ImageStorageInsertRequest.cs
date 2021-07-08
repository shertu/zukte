using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Zukte.Message.ImageStorage {
	public class ImageStorageInsertRequest {
		[Required]
		public IFormFile? Image { get; set; }

		public class ImageStorageInsertResponse {
			public string? InsertedImageUrl { get; set; }
		}
	}
}
