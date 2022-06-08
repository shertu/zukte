using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zukte.Database;
using Zukte.Utilities;
using Zukte.Utilities.Pagination;
using Zukte.Authorization.Requirements;

namespace Zukte.Service;
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ApplicationUserController : ControllerBase, IPaginationService<string>
{
  public const int PAGE_SIZE_HINT_MAXIMUM = 50;

  private readonly ApplicationDbContext db;

  private readonly IAuthorizationService authorizationService;

  public ApplicationUserController(ApplicationDbContext db, IAuthorizationService authorizationService)
  {
    this.db = db;
    this.authorizationService = authorizationService;
  }

  [HttpDelete, Authorize]
  public async Task<IActionResult> Delete([FromQuery] ApplicationUserDeleteRequest request)
  {
    #region filter
    var queryable = db.ApplicationUsers.AsQueryable();
    var idCollection = new HashSet<string>(1);
    idCollection.Add(request.Id);
    queryable = ApplyIdFilter(queryable, idCollection);
    var accounts = await queryable.ToArrayAsync();
    #endregion

    #region authorization
    foreach (ApplicationUser account in accounts)
    {
      var requirement = new DirectoryWriteRequirement();
      if (!(await authorizationService.AuthorizeAsync(User, account, requirement)).Succeeded)
      {
        return Forbid();
      }
    }
    #endregion

    db.ApplicationUsers.RemoveRange(accounts);
    await db.SaveChangesAsync();

    #region auto sign out when the user deletes their own account
    var nameIdentifierClaims = User.FindAll(claim => claim.Type == ClaimTypes.NameIdentifier);
    var accountIds = accounts.Select(account => account.Id).ToArray();
    if (nameIdentifierClaims.Any(claim => accountIds.Contains(claim.Value)))
    {
      await HttpContext.SignOutAsync();
    }
    #endregion

    return NoContent();
  }

  [HttpGet]
  public async Task<ActionResult<ApplicationUserListResponse>> GetList([FromQuery] ApplicationUserListRequest request)
  {
    #region model validation
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

    #region build queryable
    var queryable = db.ApplicationUsers.AsQueryable();
    var idCollection = request.Id.ToHashSet();
    if (idCollection.Count > 0)
    {
      queryable = ApplyIdFilter(queryable, idCollection);
    }
    queryable = ApplyMineFitler(queryable, request.Mine);
    queryable = queryable.OrderBy(e => e.Id);
    if (TryParseContinuationToken(request.ContinuationToken, out string v))
    {
      queryable = queryable.Where(e => string.Compare(e.Id, v) > 0);
    }
    queryable = queryable.ApplyPageHintSize(request.PageSizeHint, PAGE_SIZE_HINT_MAXIMUM);
    #endregion

    #region build response
    ApplicationUser[] items = await queryable.ToArrayAsync();
    var response = new ApplicationUserListResponse();
    response.Items.Add(items);
    if (items.Length > 0)
    {
      var item = items[items.Length - 1];
      response.ContinuationToken = EncodeContinuationToken(item.Id);
    }
    #endregion

    return response;
  }

  /// <summary>
  /// Applies a filter to select accounts owned by the user.
  /// </summary>
  [NonAction]
  private IQueryable<ApplicationUser> ApplyMineFitler(IQueryable<ApplicationUser> query, bool mine)
  {
    if (mine)
    {
      var ids = User.FindAll(claim => claim.Type == ClaimTypes.NameIdentifier)
          .Select(claim => claim.Value)
          .ToHashSet();

      query = ApplyIdFilter(query, ids);
    }

    return query;
  }

  /// <summary>
  /// Applies a filter to select accounts with the specified ids.
  /// </summary>
  [NonAction]
  private IQueryable<ApplicationUser> ApplyIdFilter(IQueryable<ApplicationUser> query, ISet<string> ids)
  {
    return query.Where(user => ids.Contains(user.Id));
  }

  [NonAction]
  public bool ApplicationUserExists(string id)
  {
    return db.ApplicationUsers.Any(e => e.Id == id);
  }

  [NonAction]
  public bool TryParseContinuationToken(string continuationToken, out string v)
  {
    v = continuationToken;
    return !string.IsNullOrEmpty(v);
  }

  [NonAction]
  public string EncodeContinuationToken(string v)
  {
    return v;
  }
}
