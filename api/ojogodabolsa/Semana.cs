using data;
using framework.Extensions;
using framework.Validators;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa
{
    public enum SituacaoDaSemana
    {
        NaoInformada = 0,
        Infor
    }

    public class Semana: ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Semana";
        public Genero GeneroDaEntidade => Genero.Feminino;

        [NumberValidation(MinValue = 1, MinValueMessage = "Informe o ano.")]
        public int Ano { get; set; }        
        [NumberValidation(MinValue = 1, MinValueMessage = "Informe o número da semana.", 
            MaxValue = 53, MaxValueMessage = "O ano pode ter no máximo 53 semanas.")]
        public int Numero { get; set; }
        [RequiredValidation("Informe o nome da semana.")]
        public string Nome { get; set; }
        public string Descricao { get; set; }
        [RequiredValidation("Informe a data inicial da apuração.")]
        public DateTime DataIncialDaApuracao { get; set; }
        [RequiredValidation("Informe a data final da apuração.")]
        public DateTime DataFinalDaApuracao { get; set; }
        [RequiredValidation("Informe a data de fechamento dos jogos.")]
        public DateTime DataDeFechamentoDosJogos { get; set; }
        [RequiredValidation("Informe a data de abertura dos jogos.")]
        public DateTime DataDeAberturaDosJogos { get; set; }
        [RequiredValidation("Informe a hora de fechamento dos jogos.")]
        public TimeSpan HoraDeFechamentoDosJogos { get; set; }
        [RequiredValidation("Informe a data de abertura dos jogos.")]
        public TimeSpan HoraDeAberturaDosJogos { get; set; }
        public bool EmailDeAberturaEnviado { get; set; }
        public bool EmailDeFechamentoEnviado { get; set; }

        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Numero);
            result.Append(Nome);
            result.Append(Descricao);
            return SearchableBuilder.Build(result.ToString());
        }

        public virtual string ProcessarTemplate(string template)
        {
            var itens = new Dictionary<string, string>()
            {
                {"[Semana.Nome]", GetValueOrEmptyString(Nome)},
                {"[Semana.Numero]", Numero.ToString()},
                {"[Semana.Ano]", Ano.ToString()},
                {"[Semana.DataIncialDaApuracao]", DataIncialDaApuracao.ToString("dd/MM/yyyy")},
                {"[Semana.DataFinalDaApuracao]", DataFinalDaApuracao.ToString("dd/MM/yyyy")},
                {"[Semana.DataDeAberturaDosJogos]", DataDeAberturaDosJogos.ToString("dd/MM/yyyy")},
                {"[Semana.HoraDeAberturaDosJogos]", HoraDeAberturaDosJogos.ToHoraString()},
                {"[Semana.DataDeFechamentoDosJogos]", DataDeFechamentoDosJogos.ToString("dd/MM/yyyy")},
                {"[Semana.HoraDeFechamentoDosJogos]", HoraDeFechamentoDosJogos.ToHoraString()},
            };
            foreach (var i in itens)
            {
                template = template.Replace(i.Key, i.Value);
            }
            return template;
        }

        private string GetValueOrEmptyString(string value)
        {
            var result = string.IsNullOrWhiteSpace(value) ? "" : value;
            return result;
        }
    }
}