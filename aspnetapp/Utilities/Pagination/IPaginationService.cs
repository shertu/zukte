
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Zukte.Utilities.Pagination {

	public interface IPaginationService<T> {
		int MaxResultsMax { get; }
		int MaxResultsDefault { get; }

		IQueryable<T> ApplyMaxResults(IQueryable<T> query);
		IQueryable<T> ApplyMaxResults(IQueryable<T> query, int top);
		IQueryable<T> ApplyOrderTransform(IQueryable<T> query);
		// IQueryable<T> ApplyOrderTransform(IQueryable<T> query, Expression<Func<T, IComparable>> transform);
		IQueryable<T> ApplySkipTransform(IQueryable<T> query, int skip);
	}
}