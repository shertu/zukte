using Newtonsoft.Json;
using System.Collections.Generic;

namespace zukte.com.Models {
  public class ListResponse<T> {
    [JsonProperty("items")]
    public virtual IList<T> Items { get; set; } = new T[0];

    /// <summary>
    /// The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
    /// </summary>
    [JsonProperty("nextPageToken")]
    public virtual string NextPageToken { get; set; } = string.Empty;

    /// <summary>
    /// The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
    /// </summary>
    [JsonProperty("prevPageToken")]
    public virtual string PrevPageToken { get; set; } = string.Empty;

    /// <summary>
    /// The number of results included in the API response.
    /// </summary>
    [JsonProperty("resultsPerPage")]
    public virtual int? ResultsPerPage { get; set; }

    /// <summary>
    /// The total number of results in the result set.
    /// </summary>
    [JsonProperty("totalResults")]
    public virtual int? TotalResults { get; set; }
  }
}
