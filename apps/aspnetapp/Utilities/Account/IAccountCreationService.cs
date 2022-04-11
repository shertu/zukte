
namespace Zukte.Utilities.Account;
public interface IAccountCreationService
{
  /// <summary>
  /// Adds a user account to the database or web application.
  /// </summary>
  Task<ApplicationUser> PostApplicationUser(ApplicationUser applicationUser);
}

