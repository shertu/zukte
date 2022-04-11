using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zukte.Database;
using Zukte.Utilities;
using Zukte.Utilities.Pagination;
using Google.Protobuf;
using System.Text.Json;

namespace Zukte.Service;
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ApplicationUserService : ControllerBase
{
  public const int PAGE_SIZE_HINT_MAXIMUM = 50;

  private readonly ApplicationDbContext db;

  private readonly IAuthorizationService authorizationService;

  public ApplicationUserService(ApplicationDbContext db, IAuthorizationService authorizationService)
  {
    this.db = db;
    this.authorizationService = authorizationService;
  }

  [HttpDelete, Authorize]
  public async Task<IActionResult> Delete([FromQuery] ApplicationUserDeleteRequest request)
  {
    #region filter
    var query = db.ApplicationUsers!.AsQueryable();
    query = ApplyIdFilter(query, false, request.Id);
    #endregion

    #region authorization
    foreach (ApplicationUser user in query)
    {
      AuthorizationResult auth = await authorizationService.AuthorizeAsync(HttpContext.User, user, new Authorization.Requirements.DirectoryWriteRequirement());
      if (!auth.Succeeded)
      {
        return Forbid();
      }
    }
    #endregion

    db.ApplicationUsers.RemoveRange(query);
    await db.SaveChangesAsync();

    #region sign out if user deleted their own account
    string? id = User.FindFirstValue(ClaimTypes.NameIdentifier);
    ApplicationUser? mine = await db.ApplicationUsers.FindAsync(id);
    if (mine == null)
    {
      await HttpContext.SignOutAsync();
    }
    #endregion

    return NoContent();
  }

  [HttpGet]
  public async Task<ActionResult<ApplicationUserListResponse>> GetList([FromQuery] ApplicationUserListRequest request)
  {
    #region input validation
    if (request.PageSizeHint <= 0)
    {
      ModelState.AddModelError("PSH-001", "page size hint should be greater than zero");
    }

    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }
    #endregion

    #region authentication
    if (request.Mine && !User.HasAuthenticatedIdentity())
    {
      return Challenge(); // issue a default challenge
    }
    #endregion

    #region filter
    var q = db.ApplicationUsers!.AsQueryable();
    q = ApplyIdFilter(q, true, request.Id.ToArray());
    q = ApplyMineFitler(q, request.Mine, HttpContext.User);
    #endregion

    // we page elements in order of ascending user id
    q = q.OrderBy(e => e.Id);
    q = q.Where(e => string.Compare(e.Id, request.ContinuationToken) > 0);

    // apply limit to no. of elements
    q = q.ApplyPageHintSize(request.PageSizeHint, PAGE_SIZE_HINT_MAXIMUM);

    ApplicationUser[] items = await q.ToArrayAsync();
    var response = new ApplicationUserListResponse();
    response.Items.Add(items);

    // set the next continuation token
    if (items.Length > 0)
    {
      var item = items[items.Length - 1];
      response.ContinuationToken = item.Id;
    }

    return response;
  }

  /// <summary>
  /// Applies a filter to select accounts owned by the user.
  /// </summary>
  [NonAction]
  private IQueryable<ApplicationUser> ApplyMineFitler(IQueryable<ApplicationUser> query, bool mine, ClaimsPrincipal principle)
  {
    if (mine)
    {
      string[] idCollection = principle.FindAll(claim => claim.Type == ClaimTypes.NameIdentifier)
          .Select(claim => claim.Value)
          .ToArray();

      query = ApplyIdFilter(query, false, idCollection);
    }

    return query;
  }

  /// <summary>
  /// Applies a filter to select accounts with the specified ids.
  /// </summary>
  [NonAction]
  private IQueryable<ApplicationUser> ApplyIdFilter(IQueryable<ApplicationUser> query, bool noneEqualAll, params string[] ids)
  {
    if (ids.Length > 0 || !noneEqualAll)
    {
      query = query.Where(user => ids.Contains(user.Id));
    }

    return query;
  }
}

