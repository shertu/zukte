using Microsoft.EntityFrameworkCore;
using Zukte.Database;

namespace Zukte.Utilities.Account;
public class AccountCreationService : IAccountCreationService
{
  private readonly ApplicationDbContext db;

  public AccountCreationService(ApplicationDbContext db)
  {
    this.db = db;
  }

  public async Task<ApplicationUser> PostApplicationUser(ApplicationUser user)
  {
    db.ApplicationUsers.Add(user);
    try
    {
      await db.SaveChangesAsync();
    }
    catch (DbUpdateException)
    {
      if (ApplicationUserExists(user.Id))
      {
        throw new PostApplicationUserConflictException(
            $"an application user with id, {user.Id}, already exists");
      }
      else
      {
        throw;
      }
    }

    return user;
  }

  private bool ApplicationUserExists(string id)
  {
    return db.ApplicationUsers.Any(e => e.Id == id);
  }
}

