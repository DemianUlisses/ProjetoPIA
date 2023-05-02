using data;
using System;
using framework.Validators;
using System.Collections.Generic;

namespace ojogodabolsa
{
    public class Palpite: IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Palpite";
        public Genero GeneroDaEntidade => Genero.Masculino;
        [RequiredValidation("Data de inclusão deve ser informada.")]
        public DateTime DataDeInclusao { get; set; }
        [RequiredValidation("Jogador deve ser informado.")]
        public Jogador Jogador { get; set; }
        [RequiredValidation("Semana deve ser informado.")]
        public Semana Semana { get; set; }
        [RequiredValidation("Informe a primeira ação que mais vai valorizar na semana.")]
        public Ganhador Acao1 { get; set; }
        [RequiredValidation("Informe a segunda ação que mais vai valorizar na semana.")]
        public Ganhador Acao2 { get; set; }
        [RequiredValidation("Informe a terceira ação que mais vai valorizar na semana.")]
        public Ganhador Acao3 { get; set; }
        [RequiredValidation("Informe a quarta ação que mais vai valorizar na semana.")]
        public Ganhador Acao4 { get; set; }
        [RequiredValidation("Informe a quinta ação que mais vai valorizar na semana.")]
        public Ganhador Acao5 { get; set; }
        [RequiredValidation("Informe a ação que mais vai desvalorizar na semana.")]
        public Ganhador PiorAcao { get; set; }

        public virtual string ProcessarTemplate(string template)
        {
            var itens = new Dictionary<string, string>()
            {
                {"[Palpite.PrimeiraAcao]", GetValueOrEmptyString(Acao1?.Nome)},
                {"[Palpite.SegundaAcao]", GetValueOrEmptyString( Acao2?.Nome)},
                {"[Palpite.TerceiraAcao]", GetValueOrEmptyString( Acao3?.Nome)},
                {"[Palpite.QuartaAcao]", GetValueOrEmptyString(Acao4?.Nome)},
                {"[Palpite.QuintaAcao]", GetValueOrEmptyString(Acao5?.Nome)},
                {"[Palpite.PiorAcao]", GetValueOrEmptyString(PiorAcao?.Nome)},
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