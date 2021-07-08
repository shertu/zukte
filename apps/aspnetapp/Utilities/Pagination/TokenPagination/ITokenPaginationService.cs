using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Zukte.Utilities.Pagination.TokenPagination {
	/// <summary>
	/// Note that pagination seek fields are required to be unique, ordinal, and immutable.
	/// </summary>
	/// <typeparam name="T">The type of the items in the page response.</typeparam>
	public interface ITokenPaginationService<T> {
		int PageSizeHintMaximum { get; }
		int PageSizeHintDefault { get; }

		ValueTask<Page<T>> GetNextPageAsync(IQueryable<T> postFilterQuery, string continuationToken, int? pageSizeHint);
		ValueTask<Page<T>> GetNextPageAsync(IQueryable<T> postFilterQuery, string continuationToken, int? pageSizeHint, CancellationToken cancellationToken);
	}
}