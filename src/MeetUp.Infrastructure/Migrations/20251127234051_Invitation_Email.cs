using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetUp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Invitation_Email : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invitations_Users_UserId",
                table: "Invitations");

            migrationBuilder.DropIndex(
                name: "IX_Invitations_UserId",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Invitations");

            migrationBuilder.AddColumn<string>(
                name: "UserEmail",
                table: "Invitations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserEmail",
                table: "Invitations");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Invitations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Invitations_UserId",
                table: "Invitations",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invitations_Users_UserId",
                table: "Invitations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
