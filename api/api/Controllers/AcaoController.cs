using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("acao")]
    [Route("acao/[action]")]
    public class AcaoController : CustomController<Ganhador>
    {
        public AcaoController(
            Repository<Ganhador> repository,
            Mensagens mensagens, Cfg cfg) :
            base(repository, mensagens, cfg)
        {
        }
    }
}