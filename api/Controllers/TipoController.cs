using ojogodabolsa;
using framework.Extensions;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace api.Controllers
{
    [Route("tipo")]
    [ApiController]
    public class TipoController : ControllerBase
    {
        private TipoConversor TipoConversor;

        public TipoController(TipoConversor tipoConversor)
        {
            TipoConversor = tipoConversor;
        }

        [HttpGet("{nome}")]
        [EnableQuery]
        public IQueryable<TipoViewModel> Get(string nome)
        {

            var tipos = new List<Type>()
            {
                typeof(TipoDeUsuario),
                typeof(Sexo),
                typeof(TipoDePessoa),
                typeof(TipoDeEndereco),
                typeof(TipoDeTelefone),
                //typeof(SituacaoDeSala),
            };

            var tiposDict = new Dictionary<string, Type>();

            foreach(var tipo in tipos)
            {
                tiposDict.Add(tipo.Name.ToLower(), tipo);
            }

            IEnumerable<TipoViewModel> result = new TipoViewModel[] { };

            if (tiposDict.ContainsKey(nome))
            {
                result = TipoConversor.GetTipos(tiposDict[nome]);
            }

            return result.AsQueryable();
        }
    }

    public class TipoViewModel
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
    }


    public class TipoConversor
    {
        public IEnumerable<TipoViewModel> GetTipos(Type tipo)
        {
            var tipos = new List<TipoViewModel>();
            foreach (var value in Enum.GetValues(tipo))
            {
                tipos.Add(new TipoViewModel()
                {
                    Id = (int)value,
                    Descricao = value.Description(),
                });
            }
            return tipos;
        }
    }
}
