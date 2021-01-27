using Microsoft.EntityFrameworkCore.Migrations;

namespace zukte.Migrations {
	public partial class InitialCreate : Migration {
		protected override void Up(MigrationBuilder migrationBuilder) {
			migrationBuilder.CreateTable(
				name: "ApplicationUsers",
				columns: table => new {
					Id = table.Column<string>(type: "varchar(767)", nullable: false),
					ConcurrencyStamp = table.Column<byte[]>(type: "varbinary(16)", nullable: false),
					Name = table.Column<string>(type: "text", nullable: true),
					AvatarUrl = table.Column<string>(type: "text", nullable: true)
				},
				constraints: table => {
					table.PrimaryKey("PK_ApplicationUsers", x => x.Id);
				});
		}

		protected override void Down(MigrationBuilder migrationBuilder) {
			migrationBuilder.DropTable(
				name: "ApplicationUsers");
		}
	}
}
