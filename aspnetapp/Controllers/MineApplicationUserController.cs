using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using zukte.com.Models;
using zukte.com.Utilities;

namespace zukte.com.Controllers {
  [Route("api/[controller]")]
  [ApiController, Authorize]
  public class MineApplicationUserController : ControllerBase {
    private readonly ApplicationUsersController _applicationUsersController;
    private readonly GoogleCredentialManager _googleCredentialManager;

    public MineApplicationUserController(ApplicationUsersController applicationUsersController, GoogleCredentialManager googleCredentialManager) {
      _applicationUsersController = applicationUsersController;
      _googleCredentialManager = googleCredentialManager;
    }

    [HttpGet]
    public async Task<ActionResult<ApplicationUser>> GetMineApplicationUser() {
      string id = User.GetGoogleNameIdentifier();
      _applicationUsersController.ControllerContext = ControllerContext;
      return await _applicationUsersController.GetApplicationUser(id);
    }

    [HttpPost]
    public async Task<ActionResult<ApplicationUser>> PostMineApplicationUser() {
      string id = User.GetLocalAuthorityNameIdentifier();
      UserCredential userCredential = await _googleCredentialManager.LoadUserCredentialsAsync(id);
      GoogleProfile googleProfile = await GoogleProfile.FetchGoogleProfileAsync(userCredential.Token);

      ApplicationUser applicationUser = CreateApplicationUserFromGoogleProfile(googleProfile);
      ClaimsIdentity identity = CreateClaimsIdentityFromApplicationUser(applicationUser, ClaimsExtensions.GoogleClaimIssuer);
      User.AddIdentity(identity); // required to be authorized to post a new application user

      _applicationUsersController.ControllerContext = ControllerContext;
      return await _applicationUsersController.PostApplicationUser(applicationUser);
    }

    private ApplicationUser CreateApplicationUserFromGoogleProfile(GoogleProfile profile) {
      return new ApplicationUser {
        Id = profile.Sub ?? throw new ArgumentNullException("Failed to extract an identifier from the user's Google profile."),
        Name = profile.Name,
        AvatarUrl = profile.Picture,
      };
    }

    private ClaimsIdentity CreateClaimsIdentityFromApplicationUser(ApplicationUser applicationUser, string issuer) {
      ClaimsIdentity identity = new ClaimsIdentity(AuthenticationTypes.Know);
      identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, applicationUser.Id, ClaimValueTypes.String, issuer));
      return identity;
    }

    [HttpDelete]
    public async Task<ActionResult<ApplicationUser>> DeleteMineApplicationUser() {
      string id = User.GetGoogleNameIdentifier();
      _applicationUsersController.ControllerContext = ControllerContext;
      return await _applicationUsersController.DeleteApplicationUser(id);
    }
  }
}
