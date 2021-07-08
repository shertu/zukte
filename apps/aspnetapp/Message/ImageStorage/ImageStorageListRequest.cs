using System.Collections.Generic;

namespace Zukte.Message.ImageStorage {
	public class ImageStorageListRequest {
		public string? PageToken { get; set; }
		public uint? MaxResults { get; set; }

		public class ImageStorageListResponse : IListResponse<string> {
			public string? NextPageToken { get; set; }
			public IList<string> Items { get; set; } = new string[0];
		}
	}
}
