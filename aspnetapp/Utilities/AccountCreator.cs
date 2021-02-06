using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Zukte.Database;
using Zukte.Message.ApplicationUser;

namespace Zukte.Utilities {
	public class AccountCreator {
		/// <summary>
		/// An error that occur when creating an application user which already exists.
		/// </summary>
		[System.Serializable]
		public class PostApplicationUserConflictException : System.Exception {
			public PostApplicationUserConflictException() { }
			public PostApplicationUserConflictException(string message) : base(message) { }
			public PostApplicationUserConflictException(string message, System.Exception inner) : base(message, inner) { }
			protected PostApplicationUserConflictException(
				System.Runtime.Serialization.SerializationInfo info,
				System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
		}

		private readonly ApplicationDbContext databaseService;

		public AccountCreator(ApplicationDbContext databaseService) {
			this.databaseService = databaseService;
		}

		/// <summary>
		/// Creates an account in the system.
		/// </summary>
		/// <param name="applicationUser">The application user to be created.</param>
		/// <returns>The newly created application user.</returns>
		public async Task<ApplicationUser> PostApplicationUser(ApplicationUser applicationUser) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			databaseService.ApplicationUsers.Add(applicationUser);
			try {
				await databaseService.SaveChangesAsync();
			} catch (DbUpdateException) {
				if (ApplicationUserExists(applicationUser.Id)) {
					throw new PostApplicationUserConflictException(
						$"an application user with id, {applicationUser.Id}, already exists");
				} else {
					throw;
				}
			}

			return applicationUser;
		}

		/// <summary>
		/// Checks if an application user exists in the system.
		/// </summary>
		/// <param name="id">The id of the application user to check for.</param>
		private bool ApplicationUserExists(string id) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			return databaseService.ApplicationUsers.Any(e => e.Id == id);
		}
	}
}
