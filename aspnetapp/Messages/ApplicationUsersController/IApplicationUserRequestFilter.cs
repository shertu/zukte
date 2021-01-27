namespace zukte.Messages.ApplicationUsersController {
	public interface IApplicationUserRequestFilter {
		bool Mine { get; set; }
		string? Id { get; set; }
	}
}