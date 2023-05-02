using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("estado")]
    public class EstadoController : CustomController<Estado>
    {
        public EstadoController(Repository<Estado> repository, Mensagens mensagens, Cfg cfg)
            : base(repository, mensagens, cfg)
        {
        }
    }
}