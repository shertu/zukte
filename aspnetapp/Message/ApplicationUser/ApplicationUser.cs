using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zukte.Message.ApplicationUser {
	public class ApplicationUser {
		[Required, Key]
		[JsonPropertyName("id")]
		public string Id { get; set; } = Guid.NewGuid().ToString();

		[JsonPropertyName("name")]
		public string Name { get; set; } = string.Empty;

		[DataType(DataType.ImageUrl)]
		[JsonPropertyName("picture")]
		public string Picture { get; set; } = string.Empty;
	}
}
