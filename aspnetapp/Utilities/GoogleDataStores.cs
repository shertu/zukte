using Google.Apis.Util.Store;

namespace zukte.Utilities {
	public static class GoogleDataStores {
		public static readonly IDataStore GOOGLE_AUTH_TOKEN_STORE = new FileDataStore(nameof(GOOGLE_AUTH_TOKEN_STORE));
	}
}
