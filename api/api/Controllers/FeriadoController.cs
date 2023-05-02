using api.Dtos;
using ojogodabolsa;
using ojogodabolsa.Repositories;
using data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("feriado")]
    [Route("feriado/[action]")]
    public class FeriadoController : CustomController<Feriado>
    {
        private UsuarioRepository UsuarioRepository;

        public FeriadoController(
            Repository<Feriado> repository,
            UsuarioRepository usuarioRepository,
            Mensagens mensagens, Cfg cfg) :
            base(repository, mensagens, cfg)
        {
            UsuarioRepository = usuarioRepository;
        }
    }
}