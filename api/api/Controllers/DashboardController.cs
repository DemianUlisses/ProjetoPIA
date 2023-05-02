using ojogodabolsa;
using data;
using Microsoft.AspNetCore.Mvc;
using ojogodabolsa.Repositories;
using System.Linq;
using System;
using api.Dtos;

namespace api.Controllers
{
    [Route("dashboard/[action]")]
    [Route("dashboard")]
    public class DashboardController : CustomController<Dashboard>
    {
        private readonly SemanaRepository SemanaRepository;

        public DashboardController(Repository<Dashboard> repository,
            SemanaRepository semanaRepository,
            Mensagens mensagens, Cfg cfg)
            : base(repository, mensagens, cfg)
        {
            SemanaRepository = semanaRepository;
        }

        [ActionName("combos-para-cadastro")]
        public CombosParaCadastroDeDashboard GetCombosParaCadastro()
        {
            var result = new CombosParaCadastroDeDashboard()
            {
                Semanas = SemanaRepository.GetAll().OrderBy(i => i.Ano).ThenBy(i => i.Numero)
                    .ToArray()
            };
            return result;
        }

        [ActionName("dashboard-jogador")]
        public DashboardDto[] GetDashboarParaJogador()
        {
            var hoje = DateTime.Now;
            var hora = DateTime.Now.TimeOfDay;

            var result = Repository.GetAll()
                .Where(i => i.Situacao == SituacaoDeDashboard.Ativo)
                .Where( i => ((i.DataParaPublicacao <= hoje) || (i.DataParaPublicacao == hoje && i.HoraParaPublicacao <= hora) && 
                    (i.DataParaArquivamento > hoje)))
                .OrderByDescending(i => i.DataParaPublicacao)
                .ThenByDescending(i => i.HoraParaPublicacao)
                .Select(i => DashboardDto.Build(i))
                .ToArray();
            return result;
        }

        public class CombosParaCadastroDeDashboard
        {
            public Semana[] Semanas { get; set; }
        }
    }

    public class DashboardDto
    {
        public long Id { get; set; }
        public SemanaDto Semana { get; set; }
        public string Titulo { get; set; }
        public string Detalhes { get; set; }
        public ArquivoDto Imagem { get; set; }

        public static DashboardDto Build(Dashboard item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new DashboardDto()
            {
                Id = item.Id,
                Imagem = ArquivoDto.Build(item.Imagem),
                Semana = SemanaDto.Build(item.Semana),
                Titulo = item.Titulo,
                Detalhes = item.Detalhes
            };
            return result;
        }
    }
}