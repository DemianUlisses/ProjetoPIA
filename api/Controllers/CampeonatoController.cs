using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Linq;

namespace api.Controllers
{
    [Route("campeonato/[action]")]
    [Route("campeonato")]
    public class CampeonatoController : CustomController<Campeonato>
    {
        public CampeonatoController(Repository<Campeonato> repository, Mensagens mensagens, Cfg cfg)
            : base(repository, mensagens, cfg)
        {
        }
    }
}
