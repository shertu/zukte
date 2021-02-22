using System.ComponentModel.DataAnnotations;

namespace Zukte.Message.ApplicationUser {
	public class ApplicationUserDeleteRequest {
		[Required]
		public string Id { get; set; } = string.Empty;
	}
}
