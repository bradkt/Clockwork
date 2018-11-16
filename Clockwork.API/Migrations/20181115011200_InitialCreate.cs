using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Clockwork.API.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CurrentTimeQueries",
                columns: table => new
                {
                    CurrentTimeQueryId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClientIp = table.Column<string>(nullable: true),
                    Time = table.Column<DateTime>(nullable: false),
                    UTCTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurrentTimeQueries", x => x.CurrentTimeQueryId);
                });

            migrationBuilder.CreateTable(
                name: "CurrentTimeZones",
                columns: table => new
                {
                    CurrentTimeZoneId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TimeZoneName = table.Column<string>(nullable: true),
                    UTCTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CurrentTimeZones", x => x.CurrentTimeZoneId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CurrentTimeQueries");

            migrationBuilder.DropTable(
                name: "CurrentTimeZones");
        }
    }
}
