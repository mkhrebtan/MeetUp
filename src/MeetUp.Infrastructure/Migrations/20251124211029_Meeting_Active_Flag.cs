using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetUp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Meeting_Active_Flag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Meetings",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Meetings");
        }
    }
}
