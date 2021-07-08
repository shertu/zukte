using System.Collections.Generic;

namespace Zukte.Message.ApplicationUser {
	public class ApplicationUserListRequest : IListRequest {
		public string? PageToken { get; set; }
		public uint? MaxResults { get; set; }

		public string? Id { get; set; }
		public bool Mine { get; set; }

		public class ApplicationUserListResponse : IListResponse<Entity.ApplicationUser> {
			public string? NextPageToken { get; set; }

			public IList<Entity.ApplicationUser> Items { get; set; } = new Entity.ApplicationUser[0];
		}
	}
}
