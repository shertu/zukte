using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using zukte.Database;
using zukte.Models;

namespace zukte.Controllers {
	public class CreateApplicationUsersController {
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

		public CreateApplicationUsersController(ApplicationDbContext databaseService) {
			this.databaseService = databaseService;
		}

		// do not expose this endpoint publically
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

		private bool ApplicationUserExists(string id) {
			if (databaseService.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(databaseService.ApplicationUsers));

			return databaseService.ApplicationUsers.Any(e => e.Id == id);
		}
	}
}
