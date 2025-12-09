using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetUp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Shared_Record_Indexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_SharedRecords_OwnerId_RecipientId_StorageKey",
                table: "SharedRecords",
                columns: new[] { "OwnerId", "RecipientId", "StorageKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SharedRecords_StorageKey",
                table: "SharedRecords",
                column: "StorageKey",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SharedRecords_OwnerId_RecipientId_StorageKey",
                table: "SharedRecords");

            migrationBuilder.DropIndex(
                name: "IX_SharedRecords_StorageKey",
                table: "SharedRecords");
        }
    }
}
