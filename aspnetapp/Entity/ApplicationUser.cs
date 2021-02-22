using System;
using System.ComponentModel.DataAnnotations;

namespace Zukte.Entity {
	public class ApplicationUser {
		[Required]
		public string Id { get; set; } = Guid.Empty.ToString();

		public string? Name { get; set; }

		[DataType(DataType.ImageUrl)]
		public string? Picture { get; set; }
	}
}