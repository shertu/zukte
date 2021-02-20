using System.Collections.Generic;

namespace Zukte.Utilities.Pagination.TokenPagination {
	public struct Page<T> {
		public readonly IReadOnlyList<T> values;
		public readonly string? continuationToken;

		public Page(IReadOnlyList<T> values, string? continuationToken) {
			this.values = values;
			this.continuationToken = continuationToken;
		}
	}
}
