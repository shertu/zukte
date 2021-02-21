namespace Zukte.Message {
	public interface IListRequest {
		string PageToken { get; set; }

		uint MaxResults { get; set; }

	}
}