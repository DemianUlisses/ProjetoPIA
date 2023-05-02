using ojogodabolsa;
using ojogodabolsa.Repositories;
using data;
using Microsoft.AspNetCore.Mvc;
using static api.Controllers.PalpiteController;
using System.Linq;
using System;

namespace api.Controllers
{
    [Route("semana")]
    [Route("semana/[action]")]
    public class SemanaController : CustomController<Semana>
    {
        public SemanaController(
            SemanaRepository repository,
            Mensagens mensagens, Cfg cfg) :
            base(repository, mensagens, cfg)
        {
        }

        [ActionName("semana-ativa")]
        public SemanaDto GetSemanaAtiva()
        {
            var now = DateTime.Now;
            var semanas = Repository.GetAll()
                .Where((i => (i.DataDeAberturaDosJogos < now.Date) ||
                             ((i.DataDeAberturaDosJogos == now.Date) &&
                              (i.HoraDeAberturaDosJogos <= now.TimeOfDay))))
                .Where((i => ((i.DataDeFechamentoDosJogos > now.Date) ||
                             ((i.DataDeFechamentoDosJogos == now.Date) &&
                              (i.HoraDeFechamentoDosJogos >= now.TimeOfDay)))));
            if (semanas.Count() > 1)
            {
                throw new Exception("Erro interno do sistema, econtrada mais de uma semana ativa simultaneamente.");
            }
            var result = SemanaDto.Build(semanas.FirstOrDefault());
            return result;
        }

        protected override void AntesDeInserir(Semana item)
        {
            item.DataDeAberturaDosJogos = item.DataDeAberturaDosJogos.Date;
            item.DataDeFechamentoDosJogos = item.DataDeFechamentoDosJogos.Date;
            item.DataIncialDaApuracao = item.DataIncialDaApuracao.Date;
            item.DataFinalDaApuracao = item.DataFinalDaApuracao.Date;
        }

        protected override void AntesDeAlterar(Semana item)
        {
            item.DataDeAberturaDosJogos = item.DataDeAberturaDosJogos.Date;
            item.DataDeFechamentoDosJogos = item.DataDeFechamentoDosJogos.Date;
            item.DataIncialDaApuracao = item.DataIncialDaApuracao.Date;
            item.DataFinalDaApuracao = item.DataFinalDaApuracao.Date;
        }
    }
}