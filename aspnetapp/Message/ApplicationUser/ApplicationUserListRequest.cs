using System;
using System.Text.Json.Serialization;

namespace Zukte.Message.ApplicationUser {
	public class ApplicationUserListRequest {
		// a seek pagination token
		[JsonPropertyName("pageToken")]
		public string PageToken { get; set; } = string.Empty;

		// a pagination size limiter
		[JsonPropertyName("maxResults")]
		public UInt32 MaxResults { get; set; } = 0;

		// a filter used to select user accounts with the specified ids
		[JsonPropertyName("id")]
		public string Id { get; set; } = string.Empty;

		// a filter used to select user accounts associated with an authenticated user
		[JsonPropertyName("mine")]
		public bool Mine { get; set; } = false;

		public class ApplicationUserListResponse {
			[JsonPropertyName("items")]
			public ApplicationUser[] Items { get; set; } = new ApplicationUser[0];

			[JsonPropertyName("nextPageToken")]
			public string NextPageToken { get; set; } = string.Empty;

			[JsonPropertyName("prevPageToken")]
			public string PrevPageToken { get; set; } = string.Empty;
		}
	}
}