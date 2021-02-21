namespace Zukte.Message.ImageStorage {
	public class ImageStorageListRequest {
		public string PageToken { get; set; }
		public uint MaxResults { get; set; }

		public class Response : IListResponse {
			public string NextPageToken { get; set; }
		}
	}
}
