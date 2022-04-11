namespace Zukte.Utilities.Pagination;
public static class IQueryableExtensions
{
  public static IQueryable<T> ApplyPageHintSize<T>(this IQueryable<T> query, int pageSizeHint, int pageSizeHintMaximum)
  {
    if (pageSizeHint > pageSizeHintMaximum)
    {
      pageSizeHint = pageSizeHintMaximum;
    }

    return query.Take(pageSizeHint);
  }
}
