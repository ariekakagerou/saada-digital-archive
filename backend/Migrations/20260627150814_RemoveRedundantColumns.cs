using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlumniSmartArchive.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRedundantColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "nomor_skl",
                table: "detail_skl");

            migrationBuilder.DropColumn(
                name: "nomor_ijazah",
                table: "detail_ijazah");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "nomor_skl",
                table: "detail_skl",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "nomor_ijazah",
                table: "detail_ijazah",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
