using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Zukte.Database;
using Zukte.Entity;

namespace Zukte.Utilities.Account {
	/// <inheritdoc/>
	public class AccountCreationService : IAccountCreationService {
		private readonly ApplicationDbContext _dbContext;

		public AccountCreationService(ApplicationDbContext dbContext) {
			_dbContext = dbContext;
		}

		public async Task<ApplicationUser> PostApplicationUser(ApplicationUser applicationUser) {
			if (_dbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(_dbContext.ApplicationUsers));

			_dbContext.ApplicationUsers.Add(applicationUser);
			try {
				await _dbContext.SaveChangesAsync();
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
			if (_dbContext.ApplicationUsers == null)
				throw new ArgumentNullException(nameof(_dbContext.ApplicationUsers));

			return _dbContext.ApplicationUsers.Any(e => e.Id == id);
		}
	}
}
