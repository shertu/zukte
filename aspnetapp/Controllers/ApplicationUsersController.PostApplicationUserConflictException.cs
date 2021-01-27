namespace zukte.Controllers {
	public partial class ApplicationUsersController {
		[System.Serializable]
		public class PostApplicationUserConflictException : System.Exception {
			public PostApplicationUserConflictException() { }
			public PostApplicationUserConflictException(string message) : base(message) { }
			public PostApplicationUserConflictException(string message, System.Exception inner) : base(message, inner) { }
			protected PostApplicationUserConflictException(
				System.Runtime.Serialization.SerializationInfo info,
				System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
		}
	}
}
