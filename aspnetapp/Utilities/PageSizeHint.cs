namespace Zukte.Utilities {
	public class PageSizeHint {
		public static int? FromMaxResults(uint? max) {
			return (max == null || max == 0) ? null : (int)max;
		}
	}
}