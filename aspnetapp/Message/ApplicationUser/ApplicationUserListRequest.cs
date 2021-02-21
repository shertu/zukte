namespace Zukte.Message.ApplicationUser {
	public class ApplicationUserListRequest : IListRequest {
		public string PageToken { get; set; }
		public uint MaxResults { get; set; }

		public class Response : IListResponse {
			public string NextPageToken { get; set; }
		}
	}
}
