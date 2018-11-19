using System;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;

namespace Clockwork.API.Controllers
{
    [Route("api/[controller]")]
    public class TimeZoneController : Controller
    {
        // GET api/timezone
        [HttpGet]
        public IActionResult Get(string selectedTimeZone)
        {

            var currentTimeZoneName = selectedTimeZone;
            var utcTime = DateTime.UtcNow;

            var timezone = new CurrentTimeZone
            {
                TimeZoneName = currentTimeZoneName,
                UTCTime = utcTime
            };

            using (var db = new ClockworkContext())
            {
                ///db.CurrentTimeZones.Update(timezone);
                db.CurrentTimeZones.Add(timezone);
                db.SaveChanges();
            }

            return Ok();
        }
    }
}
