using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetUp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Workspace_InviteCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InviteCode",
                table: "Workspaces",
                type: "character varying(12)",
                maxLength: 12,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_InviteCode",
                table: "Workspaces",
                column: "InviteCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Workspaces_InviteCode",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "InviteCode",
                table: "Workspaces");
        }
    }
}
