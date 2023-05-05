using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Linq;

namespace api.Controllers
{
    [Route("liga/[action]")]
    [Route("liga")]
    public class LigaController : CustomController<Liga>
    {
        public LigaController(Repository<Liga> repository, Mensagens mensagens, Cfg cfg)
            : base(repository, mensagens, cfg)
        {
        }
    }
}
