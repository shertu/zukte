using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using zukte.Models;
using zukte.Utilities;

namespace zukte.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	[Produces("application/json")]
	public class MineApplicationUserController : ControllerBase {
		private readonly ApplicationUsersController _applicationUsersController;

		public MineApplicationUserController(ApplicationUsersController applicationUsersController) {
			_applicationUsersController = applicationUsersController;
		}

		[HttpGet]
		public async Task<ActionResult<ApplicationUser>> GetMineApplicationUser() {
			string id = User.FindGoogleNameIdentifier();
			_applicationUsersController.ControllerContext = ControllerContext;
			return await _applicationUsersController.GetApplicationUser(id);
		}

		[HttpDelete]
		public async Task<ActionResult<ApplicationUser>> DeleteMineApplicationUser() {
			string id = User.FindGoogleNameIdentifier();
			_applicationUsersController.ControllerContext = ControllerContext;
			return await _applicationUsersController.DeleteApplicationUser(id);
		}
	}
}