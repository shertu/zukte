using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace zukte.Models {
	public class ModelListResponse<T> {
		[JsonPropertyName("items")]
		public virtual IList<T> Items { get; set; } = new T[0];

		/// <summary>
		/// The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
		/// </summary>
		[JsonPropertyName("nextPageToken")]
		public virtual string NextPageToken { get; set; } = string.Empty;

		/// <summary>
		/// The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
		/// </summary>
		[JsonPropertyName("prevPageToken")]
		public virtual string PrevPageToken { get; set; } = string.Empty;

		/// <summary>
		/// The number of results included in the API response.
		/// </summary>
		[JsonPropertyName("resultsPerPage")]
		public virtual int? ResultsPerPage { get; set; }

		/// <summary>
		/// The total number of results in the result set.
		/// </summary>
		[JsonPropertyName("totalResults")]
		public virtual int? TotalResults { get; set; }
	}
}
