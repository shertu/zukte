using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using zukte.Models;

namespace zukte.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	[Produces("application/json")]
	public class MineApplicationUserController : ControllerBase {
		public const string GoogleClaimIssuer = "https://accounts.google.com";
		public const string GoogleNameClaimType = "name";
		public const string GooglePictureClaimType = "picture";

		private readonly ApplicationUsersController _applicationUsersController;

		public MineApplicationUserController(ApplicationUsersController applicationUsersController) {
			_applicationUsersController = applicationUsersController;
		}

		[HttpGet]
		public async Task<ActionResult<ApplicationUser>> GetMineApplicationUser() {
			string id = FindFirstValueNameIdentifier();
			_applicationUsersController.ControllerContext = ControllerContext;
			return await _applicationUsersController.GetApplicationUser(id);
		}

		[HttpPost]
		public async Task<ActionResult<ApplicationUser>> PostMineApplicationUser() {
			string id = FindFirstValueNameIdentifier();

			ApplicationUser applicationUser = new ApplicationUser {
				Id = id,
				Name = User.FindFirstValue(GoogleNameClaimType),
				AvatarUrl = User.FindFirstValue(GooglePictureClaimType),
			};

			_applicationUsersController.ControllerContext = ControllerContext;
			return await _applicationUsersController.PostApplicationUser(applicationUser);
		}

		[HttpDelete]
		public async Task<ActionResult<ApplicationUser>> DeleteMineApplicationUser() {
			string id = FindFirstValueNameIdentifier();
			_applicationUsersController.ControllerContext = ControllerContext;
			return await _applicationUsersController.DeleteApplicationUser(id);
		}

		private string FindFirstValueNameIdentifier() {
			return User.FindFirstValue(ClaimTypes.NameIdentifier) ??
			throw new ArgumentNullException("User is authenticated but failed to find the user's name identifier.");
		}
	}
}
