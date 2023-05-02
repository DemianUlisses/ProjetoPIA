using data;
using messages;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Globalization;

namespace ojogodabolsa.Repositories
{
    public class SemanaRepository : Repository<Semana>
    {
        public SemanaRepository(IUnitOfWork<Semana> unitOfWork, IMessageControl messageControl)
            : base(unitOfWork, messageControl)
        {
        }

        public override void Insert(Semana entity)
        {
            if ((entity.Ano == 0) && (entity.DataIncialDaApuracao > DateTime.MinValue))
            {
                entity.Ano = entity.DataIncialDaApuracao.Year;
            }
            base.Insert(entity);
        }

        public override void Update(Semana entity)
        {
            if ((entity.Ano == 0) && (entity.DataIncialDaApuracao > DateTime.MinValue))
            {
                entity.Ano = entity.DataIncialDaApuracao.Year;
            }
            base.Update(entity);
        }

        public virtual Semana GetSemanaAtiva()
        {
            var now = DateTime.Now;
            var semanas = GetAll()
                .Where((i => (i.DataDeAberturaDosJogos.Date < now.Date) ||
                             ((i.DataDeAberturaDosJogos.Date == now.Date) &&
                              (i.HoraDeAberturaDosJogos <= now.TimeOfDay))))
                .Where((i => ((i.DataDeFechamentoDosJogos.Date > now.Date) ||
                             ((i.DataDeFechamentoDosJogos.Date == now.Date) &&
                              (i.HoraDeFechamentoDosJogos >= now.TimeOfDay)))));
            if (semanas.Count() > 1)
            {
                throw new Exception("Erro interno do sistema, econtrada mais de uma semana ativa simultaneamente.");
            }
            return semanas.FirstOrDefault();
        }

        public virtual Semana GetSemanaCorrente()
        {
            var currentCulture = CultureInfo.CurrentCulture;
            var numeroDaSemana = currentCulture.Calendar.GetWeekOfYear(
                DateTime.Now,
                CalendarWeekRule.FirstFullWeek,
                DayOfWeek.Sunday);
            var ano = DateTime.Now.Year;
            var semana = GetAll()
                .Where(i => i.Ano == ano)
                .Where(i => i.Numero == numeroDaSemana)
                .FirstOrDefault();
            return semana;
        }
    }
}
