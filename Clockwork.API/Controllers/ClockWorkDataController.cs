using System;
using Microsoft.AspNetCore.Mvc;
using Clockwork.API.Models;
using System.Linq;
using System.Collections.Generic;

namespace Clockwork.API.Controllers
{
    [Route("api/[controller]")]
    public class ClockWorkDataController : Controller
    {
        // GET api/clockworkdata
        [HttpGet]
        public IActionResult Get()
        {
            var list = new List<CurrentTimeQuery>();

            using (var db = new ClockworkContext())
            {
                list = db.CurrentTimeQueries.ToList();
            }

            return Ok(list);
        }
    }
}
