using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Linq;

namespace api.Controllers
{
    [Route("cidade/[action]")]
    [Route("cidade")]
    public class CidadeController : CustomController<Cidade>
    {
        public CidadeController(Repository<Cidade> repository, Mensagens mensagens, Cfg cfg)
            : base(repository, mensagens, cfg)
        {
        }

        [ActionName("buscar")]
        public virtual Cidade[] GetCidades([FromQuery]string uf, [FromQuery]string cidade)
        {
            var cidades = new Cidade[] { };
            if (!string.IsNullOrEmpty(uf) && !string.IsNullOrEmpty(cidade))
            {
                uf = uf.ToUpper();
                cidades = base.Repository.GetAll()
                    .Where(i => i.Estado.UF == uf)
                    .Where(i => i.Nome.ToLower() == cidade.ToLower())
                    .ToArray();
            }
            return cidades;
        }
    }
}
