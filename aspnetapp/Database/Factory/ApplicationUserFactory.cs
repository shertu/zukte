using System.Collections.Generic;
using Zukte.Message.ApplicationUser;

namespace Zukte.Database.Factory {
	public class ApplicationUserFactory : DatabaseFactory<ApplicationUser> {
		public override ApplicationUser CreateInstance() {
			ApplicationUser user = new ApplicationUser();
			user.Id = chance.Guid();
			user.Name = chance.FullName();
			user.Picture = chance.Avatar();
			return user;
		}
	}
}
