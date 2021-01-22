namespace zukte.com.Responses {
  public class ListRequest {
    /// <summary>
    /// The pageToken parameter identifies a specific page in the result set that should 
    /// be returned. In an API response, the nextPageToken and prevPageToken properties
    /// identify other pages that could be retrieved.
    /// </summary>
    public virtual string PageToken { get; set; } = string.Empty;

    /// <summary>
    /// The maxResults parameter specifies the maximum number of items that should be returned in the result set.
    /// </summary>
    public virtual long? MaxResults { get; set; }
  }
}
