using Microsoft.AspNetCore.Http;

namespace Zukte.Message.ImageStorage {
	public class ImageStorageInsertRequest {
		public IFormFile Blob { get; set; }

		public class Response {
			string InsertedImageUrl
		}
	}
}
