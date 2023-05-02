using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace api.Controllers
{
    [Route("parametro")]
    public class ParametroController : CustomController<Parametro>
    {
        public ParametroController(Repository<Parametro> repository, Mensagens mensagens, Cfg cfg) 
            : base(repository, mensagens, cfg)
        {
        }

        protected override void AntesDeInserir(Parametro item)
        {
            ValidarDuplicidade(item);
        }

        protected override void AntesDeAlterar(Parametro item)
        {
            ValidarDuplicidade(item);
        }

        protected virtual void ValidarDuplicidade(Parametro entity)
        {
            if (!string.IsNullOrWhiteSpace(entity.Nome))
            {
                var duplicado = Repository.GetAll()
                    .Where(i => i.Id != entity.Id)
                    .Where(i => i.Nome == entity.Nome)
                    .Any();
                if (duplicado)
                {
                    throw new Exception("Parâmetro já cadstrado.");
                }
            }
        }
    }
}
