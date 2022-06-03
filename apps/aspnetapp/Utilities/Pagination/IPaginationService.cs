namespace Zukte.Utilities.Pagination;
public interface IPaginationService<T>
{
  bool TryParseContinuationToken(string continuationToken, out T value);

  string EncodeContinuationToken(T value);
}
