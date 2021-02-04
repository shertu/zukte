using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace zukte.Messages.ApplicationUsersController {
	public class ApplicationUserDeleteRequest : IApplicationUserRequestFilter {
		[JsonPropertyName("mine")]
		public bool Mine { get; set; }

		[JsonPropertyName("id")]
		public string? Id { get; set; }

		public class ApplicationUserDeleteResponse {
			[JsonPropertyName("items")]
			public virtual IList<Models.ApplicationUser> Items { get; set; } = new Models.ApplicationUser[0];
		}
	}
}