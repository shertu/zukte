using System.Text.Json.Serialization;

namespace zukte.Messages {
	/// <summary>
	/// This is a base class for query requests.
	/// For filters, groups, orders, and selects, please extend this class.
	/// </summary>
	public abstract class ModelListRequest {
		/// <summary>
		/// The maximum number of items that should be selected by the query.
		/// </summary>
		[JsonPropertyName("top")]
		public int? Top { get; set; }

		/// <summary>
		/// The minimum number of items that should be offset by the query.
		/// </summary>
		[JsonPropertyName("skip")]
		public int Skip { get; set; }

		/// <summary>
		/// Should the number of items in the query be counted?
		/// </summary>
		[JsonPropertyName("count")]
		public bool Count { get; set; }

		/// <summary>
		/// An decipherable token used instead of skip to seek a specific row.
		/// https://use-the-index-luke.com/sql/partial-results/fetch-next-page
		/// </summary>
		[JsonPropertyName("skipToken")]
		public string? SkipToken { get; set; }
	}
}