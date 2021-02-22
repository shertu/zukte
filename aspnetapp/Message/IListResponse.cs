using System.Collections.Generic;

namespace Zukte.Message {
	public interface IListResponse<T> {
		string? NextPageToken { get; set; }

		IList<T> Items { get; set; }
	}
}