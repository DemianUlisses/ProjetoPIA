using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Linq;
using ojogodabolsa.Repositories;

namespace api.Controllers
{
    [Route("banco/[action]")]
    [Route("banco")]
    public class BancoController : CustomController<Banco>
    {
        public BancoController(Repository<Banco> repository, Mensagens mensagens, Cfg cfg)
            : base(repository, mensagens, cfg)
        {
        }
    }
}
