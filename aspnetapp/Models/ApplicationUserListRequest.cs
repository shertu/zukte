using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace zukte.Models {
	public class ApplicationUserListRequest : ModelListRequest {
		/// <summary>
		/// Should the application user be owned by the user?
		/// </summary>
		[JsonPropertyName("mine")]
		public bool Mine { get; set; }

		/// <summary>
		/// Should the application user be owned by the user?
		/// </summary>
		[JsonPropertyName("id")]
		public List<string>? Id { get; set; }
	}
}