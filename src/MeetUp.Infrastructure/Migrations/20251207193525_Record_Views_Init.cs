using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetUp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Record_Views_Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RecordViews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RecordingStorageKey = table.Column<string>(type: "text", nullable: false),
                    Views = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecordViews", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SharedRecords_RecipientId",
                table: "SharedRecords",
                column: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_RecordViews_RecordingStorageKey",
                table: "RecordViews",
                column: "RecordingStorageKey",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SharedRecords_Users_OwnerId",
                table: "SharedRecords",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SharedRecords_Users_RecipientId",
                table: "SharedRecords",
                column: "RecipientId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SharedRecords_Users_OwnerId",
                table: "SharedRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_SharedRecords_Users_RecipientId",
                table: "SharedRecords");

            migrationBuilder.DropTable(
                name: "RecordViews");

            migrationBuilder.DropIndex(
                name: "IX_SharedRecords_RecipientId",
                table: "SharedRecords");
        }
    }
}
