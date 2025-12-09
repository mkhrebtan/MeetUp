using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetUp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class User_Role : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "WorkspaceUsers");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "WorkspaceUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
