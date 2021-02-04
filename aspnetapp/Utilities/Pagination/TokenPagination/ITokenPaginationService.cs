
using System;
using System.Linq;

namespace zukte.Utilities.Pagination.TokenPagination {
	public interface ITokenPaginationService<T> : IPaginationService<T> {
		T? DecryptPageToken(string? ciphertext);
		string? EncryptPageToken(T? value);

		// pagination seek fields are required to be unique, ordinal, and immutable
		IQueryable<T> ApplyPageToken(IQueryable<T> query, T? pageToken);

		IComparable SelectKeyFromPageToken(T pageToken);

		T? GeneratePageToken(IQueryable<T> query, T[] items, bool prevToken);
	}
}