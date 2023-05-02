using ojogodabolsa.Repositories;
using data;
using framework;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace ojogodabolsa
{
    public class Feriado: ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Feriado";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public DateTime Data { get; set; }
        public string Descricao { get; set; }
        public bool Nacional { get; set; }

        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Descricao);
            return SearchableBuilder.Build(result.ToString());
        }
    }

    public static class FeriadoHelper
    {
        private static IEnumerable<FeriadoInternal> _feriados = null;

        public static bool IsDiaUtil(DateTime data, FeriadoRepository repository)
        {
            if (data.DayOfWeek == DayOfWeek.Sunday || data.DayOfWeek == DayOfWeek.Saturday)
            {
                return false;
            }
            if (_feriados == null)
            {
                _feriados = repository.GetAll().Select(i => FeriadoInternal.Build(i)).ToArray();
            }
            return !_feriados.Where(i => i.Data.Date == data.Date).Any();
        }
    }

    internal class FeriadoInternal
    {
        public DateTime Data { get; set; }
        public bool Nacional { get; set; } 

        public static FeriadoInternal Build(Feriado feriado)
        {
            return new FeriadoInternal()
            {
                Data = feriado.Data,
                Nacional = feriado.Nacional,
            };
        }
    }
}