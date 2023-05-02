using framework;
using System;
using System.Collections.Generic;

namespace ojogodabolsa
{
    public class Jogador : Pessoa
    {
        public virtual Banco Banco { get; set; }
        public virtual string AgenciaDaContaCorrente { get; set; }
        public virtual string NumeroDaContaCorrente { get; set; }
        public virtual string DigitoDaContaCorrente { get; set; }
        public virtual string ChavePix { get; set; }
        public virtual Tipo<TipoDeContaBancaria> TipoDeConta { get; set; }
        public virtual bool ReceberEmailsDeAberturaDosJogos { get; set; }
        public virtual bool ReceberEmailsDeFechamentoDosJogos { get; set; }

        public virtual string ProcessarTemplate(string template)
        {
            var itens = new Dictionary<string, string>()
            {
                {"[Jogador.NomeCompleto]", GetValueOrEmptyString(NomeCompleto)},
                {"[Jogador.Apelido]", GetValueOrEmptyString(Apelido)},
                {"[Jogador.PrimeiroNome]", GetValueOrEmptyString(Nome.PrimeiroNome)},
                {"[Jogador.NomeDoMeio]", GetValueOrEmptyString(Nome.NomeDoMeio)},
                {"[Jogador.UltimoNome]", GetValueOrEmptyString(Nome.UltimoNome)},
                {"[Jogador.Email]", GetValueOrEmptyString(Email)},
                {"[Jogador.DataDeNascimento]", GetValueOrEmptyString(DataDeNascimento.HasValue ?
                    DataDeNascimento.Value.ToString("dd/MM/yyyy") : "")},
                {"[Jogador.CPF]", GetValueOrEmptyString(Cpf)},
                {"[Data]", GetValueOrEmptyString(DateTime.Now.Date.ToString("dd/MM/yyyy"))},
                {"[Hora]", GetValueOrEmptyString(DateTime.Now.ToString("HH:mm"))},
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

    public enum TipoDeContaBancaria
    {
        NaoInformado = 0,
        ContaCorrente = 1,
        ContaPoupanca = 2
    }


}
