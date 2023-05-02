using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("acesso")]
    public class AcessoDeUsuarioController : CustomController<AcessoDePerfilDeUsuario>
    {
        public AcessoDeUsuarioController(Repository<AcessoDePerfilDeUsuario> repository, Mensagens mensagens, Cfg cfg) : 
            base(repository, mensagens, cfg)
        {
        }
    }
}