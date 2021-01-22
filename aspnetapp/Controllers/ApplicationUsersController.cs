using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using zukte.com.Authorization.Requirements;
using zukte.com.Database;
using zukte.com.Models;
using zukte.com.Utilities;

namespace zukte.com.Controllers {
  [Route("api/[controller]")]
  [ApiController]
  public class ApplicationUsersController : ControllerBase {
    private readonly ApplicationDbContext _context;
    private readonly IAuthorizationService _authorizationService;

    public ApplicationUsersController(ApplicationDbContext context, IAuthorizationService authorizationService) {
      _context = context;
      _authorizationService = authorizationService;
    }

    // GET: api/ApplicationUsers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetApplicationUsers() {
      return await _context.ApplicationUsers.ToListAsync();
    }

    // GET: api/ApplicationUsers/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationUser>> GetApplicationUser(string id) {
      var applicationUser = await _context.ApplicationUsers.FindAsync(id);

      if (applicationUser == null) {
        return NotFound();
      }

      return applicationUser;
    }

    // PUT: api/ApplicationUsers/5
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    //[HttpPut("{id}")]
    //public async Task<IActionResult> PutApplicationUser(string id, ApplicationUser applicationUser) {
    //  if (id != applicationUser.Id) {
    //    return BadRequest();
    //  }

    //  _context.Entry(applicationUser).State = EntityState.Modified;

    //  try {
    //    await _context.SaveChangesAsync();
    //  } catch (DbUpdateConcurrencyException) {
    //    if (!ApplicationUserExists(id)) {
    //      return NotFound();
    //    } else {
    //      throw;
    //    }
    //  }

    //  return NoContent();
    //}

    // POST: api/ApplicationUsers
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPost]
    public async Task<ActionResult<ApplicationUser>> PostApplicationUser(ApplicationUser applicationUser) {
      AuthorizationResult authorizationResult = await _authorizationService.AuthorizeAsync(User, applicationUser, new DirectoryWriteRequirement());
      if (!authorizationResult.Succeeded) {
        return Forbid();
      }

      _context.ApplicationUsers.Add(applicationUser);
      try {
        await _context.SaveChangesAsync();
      } catch (DbUpdateException) {
        if (ApplicationUserExists(applicationUser.Id)) {
          return Conflict();
        } else {
          throw;
        }
      }

      return CreatedAtAction("GetApplicationUser", new { id = applicationUser.Id }, applicationUser);
    }

    // DELETE: api/ApplicationUsers/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApplicationUser>> DeleteApplicationUser(string id) {
      var applicationUser = await _context.ApplicationUsers.FindAsync(id);

      AuthorizationResult authorizationResult = await _authorizationService.AuthorizeAsync(User, applicationUser, new DirectoryWriteRequirement());
      if (!authorizationResult.Succeeded) {
        return Forbid();
      }

      if (applicationUser == null) {
        return NotFound();
      }

      _context.ApplicationUsers.Remove(applicationUser);
      await _context.SaveChangesAsync();

      #region Auth SignOut Hook
      string nameIdentifier = User.GetGoogleNameIdentifier();
      if (nameIdentifier == applicationUser.Id) {
        await HttpContext.SignOutAsync();
      }
      #endregion

      return applicationUser;
    }

    private bool ApplicationUserExists(string id) {
      return _context.ApplicationUsers.Any(e => e.Id == id);
    }
  }
}
