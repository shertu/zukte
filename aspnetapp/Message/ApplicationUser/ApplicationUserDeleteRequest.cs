using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Zukte.Message.ApplicationUser {
	public class ApplicationUserDeleteRequest {
		// a filter used to select user accounts with the specified ids
		[JsonPropertyName("id")]
		public string Id { get; set; } = string.Empty;
	}
}