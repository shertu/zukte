using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace zukte.Models {
	/// <summary>
	/// Represents a user in the identity system
	/// </summary>
	public class ApplicationUser {
		/// <summary>
		/// Gets or sets the primary key for this user.
		/// </summary>
		[Key, Required]
		[JsonPropertyName("id")]
		public virtual string Id { get; set; } = Guid.NewGuid().ToString();

		/// <summary>
		/// A random value that must change whenever a user is persisted to the store.
		/// </summary>
		[ConcurrencyCheck]
		[JsonPropertyName("concurrency")]
		public virtual Guid ConcurrencyStamp { get; set; } = Guid.NewGuid();

		/// <summary>
		/// Gets or sets the name for this user.
		/// </summary>
		[JsonPropertyName("name")]
		public virtual string? Name { get; set; }

		/// <summary>
		/// Gets or sets the url of the avatar for this user.
		/// </summary>
		[DataType(DataType.ImageUrl)]
		[JsonPropertyName("avatar")]
		public virtual string? AvatarUrl { get; set; }
	}
}
