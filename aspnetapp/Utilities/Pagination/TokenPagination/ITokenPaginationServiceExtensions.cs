using System.Linq;

namespace Zukte.Utilities.Pagination.TokenPagination {
	public static class ITokenPaginationServiceExtensions {
		public static IQueryable<T> ApplyPageHintSize<T>(this ITokenPaginationService<T> service, IQueryable<T> query, int? pageSizeHint) {
			int count = pageSizeHint ?? service.PageSizeHintDefault;

			if (count > service.PageSizeHintMaximum) {
				count = service.PageSizeHintMaximum;
			}

			return query.Take(count);
		}

		public static int? ToPageSizeHint(uint? max) {
			if (max == null || max == 0) {
				return null;
			}

			return (int)max;
		}
	}
}