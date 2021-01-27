using System.Text.Json.Serialization;

namespace zukte.Messages.ApplicationUsersController {
	public class ApplicationUserListRequest : ModelListRequest, IApplicationUserRequestFilter {
		[JsonPropertyName("mine")]
		public bool Mine { get; set; }

		[JsonPropertyName("id")]
		public string? Id { get; set; }

		public class ApplicationUserListResponse : ModelListResponse<Models.ApplicationUser> {

		}
	}
}