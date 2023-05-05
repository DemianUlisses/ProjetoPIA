using ojogodabolsa;
using ojogodabolsa.Repositories;
using data;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace api.Controllers
{
    [Route("perfilusuario/[action]")]
    [Route("perfilusuario")]
    public class PerfilDeUsuarioController : CustomController<PerfilDeUsuario>
    {
        private Repository<RotinaDoSistema> RotinaDoSistemaRepository;
        private UsuarioRepository UsuarioRepository;

        public PerfilDeUsuarioController(PerfilDeUsuarioRepository repository,
            UsuarioRepository usuarioRepository,
            Repository<RotinaDoSistema> rotinaDoSistemaRepository,
            Mensagens mensagens, Cfg cfg) :
            base(repository, mensagens, cfg)
        {
            RotinaDoSistemaRepository = rotinaDoSistemaRepository;
            UsuarioRepository = usuarioRepository;
        }

        [ActionName("comborotinas")]
        [EnableQuery]
        public IQueryable<RotinaDoSistema> GetRotinasParaCadastroDePerfil ()
        {
            var result = RotinaDoSistemaRepository.GetAll()
                .ToArray()
                .Where(i => !RotinasDoSistema.RotinasLivres().Where(j => j.Key == i.Id).Any())
                .ToArray()
                .OrderBy(i => i.Id);
            return result.AsQueryable();
        }

        public override IQueryable<PerfilDeUsuario> Get()
        {
            var usuario = GetUsuario(UsuarioRepository);
            if (usuario.NomeDeUsuario.ToLower() != "master")
            {
                return base.Get().Where(i => i.Nome != "master");
            } else
            {
                return base.Get();
            }
        }

    }
}