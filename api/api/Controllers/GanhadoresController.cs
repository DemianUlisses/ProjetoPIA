using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using ojogodabolsa.Repositories;
using System.Linq;
using api.Dtos;
using Microsoft.AspNet.OData;
using System.Collections.Generic;
using System;
using framework.Extensions;

namespace api.Controllers
{
    [ApiController]
    [Route("ganhadores")]
    [Route("ganhadores/[action]")]
    public class GanhadoresController : CustomController
    {
        private readonly SemanaRepository SemanaRepository;
        private readonly Repository<Ganhadores> Repository;
        private readonly ParametrosRepository ParametrosRepository;
        private readonly PalpiteRepository PalpiteRepository;
        private readonly EnvioDeEmail EnvioDeEmail;

        public GanhadoresController(Repository<Ganhadores> repository,
            SemanaRepository semanaRepository,
            ParametrosRepository parametrosRepository,
            PalpiteRepository palpiteRepository,
            EnvioDeEmail envioDeEmail,
            Mensagens mensagens, 
            Cfg cfg)
            : base(mensagens, cfg)
        {
            Repository = repository;
            SemanaRepository = semanaRepository;
            ParametrosRepository = parametrosRepository;
            PalpiteRepository = palpiteRepository;
            EnvioDeEmail = envioDeEmail;
        }

        [ActionName("combos-para-cadastro")]
        public CombosParaCadastroDeDashboard GetCombosParaCadastro()
        {
            var result = new CombosParaCadastroDeDashboard()
            {
                Semanas = SemanaRepository.GetAll().OrderBy(i => i.Ano).ThenBy(i => i.Numero).ToArray()
            };
            return result;
        }

        [ActionName("combos-para-consulta-de-ganhadores")]
        public CombosParaConsultaDeGanhadores GetCombosParaConsultaDeGanhadoresCadastro()
        {
            var hoje = DateTime.Now;
            var result = new CombosParaConsultaDeGanhadores()
            {
                Semanas = Repository.GetAll()
                    .OrderByDescending(i => i.Semana.Ano).ThenByDescending(i => i.Semana.Numero)
                    .Select(i => SemanaDto.Build(i.Semana))
                    .ToArray()
            };
            result.UltimaSemana = result.Semanas.FirstOrDefault();
            result.GanhadoresDaUltimaSemana = result.UltimaSemana != null ?
                   GanhadoresDto.Build(Repository.GetAll()
                   .Where(i => i.Semana.Id == result.UltimaSemana.Id).ToArray().FirstOrDefault())
                : null;
            return result;
        }

        [EnableQuery]
        [HttpGet]
        public virtual IEnumerable<GanhadoresDto> Get()
        {
            var result = Repository.GetAll()
                .ToArray()
                .Select(i => GanhadoresDto.Build(i));
            return result;
        }

        [HttpGet("{id}")]
        public virtual ActionResult<GanhadoresDto> Get(long id)
        {
            var result = Repository.Get(id);
            if (result == null)
            {
                return new NotFoundResult();
            }
            return GanhadoresDto.Build(result);
        }

        [HttpPost]
        public virtual ActionResult<long> Post([FromBody] Ganhadores item)
        {
            Repository.Insert(item);
            IEnumerable<Jogador> ganhadores = new Jogador[4] { item.Ganhador1, item.Ganhador2, item.Ganhador3, item.Ultimo };
            //ganhadores.ForEach(jogador =>
            //{
            //    if (jogador.Banco == null ||
            //        string.IsNullOrWhiteSpace(jogador.AgenciaDaContaCorrente) ||
            //        string.IsNullOrWhiteSpace(jogador.NumeroDaContaCorrente) ||
            //        string.IsNullOrWhiteSpace(jogador.DigitoDaContaCorrente))
            //    {
            //        var template = ParametrosRepository.GetEmailDeSolicitacaoDeDadosBancariosParaGanhador();
            //        var mensagem = jogador.ProcessarTemplate(template);
            //        mensagem = item.Semana.ProcessarTemplate(mensagem);
            //        var palpite = PalpiteRepository.GetAll()
            //            .Where(i => i.Jogador.Id == jogador.Id)
            //            .Where(i => i.Semana.Id == item.Semana.Id)
            //            .FirstOrDefault();
            //        mensagem = palpite.ProcessarTemplate(mensagem);
            //        EnvioDeEmail.EnviarAsync("Atualize seus dados bancários", jogador.Email, mensagem);
            //    }
            //});
            return item.Id;
        }

        [HttpPut]
        public virtual ActionResult<bool> Put([FromBody] Ganhadores item)
        {
            if (Repository.Get(item.Id) == null)
            {
                return new NotFoundResult();
            }
            Repository.Update(item);
            return true;
        }

        [HttpDelete("{id}")]
        public virtual ActionResult<bool> Delete(long id)
        {
            var item = Repository.Get(id);
            if (Repository.Get(id) == null)
            {
                return new NotFoundResult();
            }
            Repository.Delete(item);
            return true;
        }

        [ActionName("ganhadores-jogador/{semana}")]
        public GanhadoresDto GetDashboarParaJogador([FromRoute] long semana)
        {
            SemanaRepository.Get(semana, true);
            var result = Repository.GetAll()
                .Where(i => i.Semana.Id == semana)
                .FirstOrDefault();
            return GanhadoresDto.Build(result);
        }
    }

    public class CombosParaCadastroDeDashboard
    {
        public Semana[] Semanas { get; set; }
    }

    public class GanhadoresDto
    {
        public long Id { get; set; }
        public string Titulo { get; set; }
        public string Detalhes { get; set; }
        public SemanaDto Semana { get; set; }
        public JogadorDto Ganhador1 { get; set; }
        public JogadorDto Ganhador2 { get; set; }
        public JogadorDto Ganhador3 { get; set; }
        public JogadorDto Ganhador4 { get; set; }
        public JogadorDto Ganhador5 { get; set; }
        public JogadorDto Ultimo { get; set; }
        public ArquivoDto Imagem { get; set; }

        public static GanhadoresDto Build(Ganhadores item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new GanhadoresDto()
            {
                Id = item.Id,
                Semana = SemanaDto.Build(item.Semana),
                Ganhador1 = JogadorDto.Build(item.Ganhador1),
                Ganhador2 = JogadorDto.Build(item.Ganhador2),
                Ganhador3 = JogadorDto.Build(item.Ganhador3),
                Ultimo = JogadorDto.Build(item.Ultimo),
                Imagem = ArquivoDto.Build(item.Imagem),
                Titulo = item.Titulo,
                Detalhes = item.Detalhes,
            };
            return result;
        }
    }

    public class CombosParaConsultaDeGanhadores
    {
        public SemanaDto[] Semanas { get; set; }
        public SemanaDto UltimaSemana { get; set; }
        public GanhadoresDto GanhadoresDaUltimaSemana { get; set; }
    }
}