using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdChannel.Web.Controllers
{
    [ApiController]
    [Route("api/utils")]
    public class UtilsController : ControllerBase
    {
        /// <summary>
        /// Возвращает IP-адрес клиента
        /// </summary>
        [HttpGet("ip")]
        [AllowAnonymous]
        public IActionResult GetClientIp()
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            return Ok(new { ip });
        }
    }
}


