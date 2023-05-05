using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("rotinasistema")]
    public class RotinaDoSistemaController : CustomController<RotinaDoSistema>
    {
        public RotinaDoSistemaController(Repository<RotinaDoSistema> repository, Mensagens mensagens, Cfg cfg) : 
            base(repository, mensagens, cfg)
        {
        }
    }
}