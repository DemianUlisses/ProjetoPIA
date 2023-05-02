using data;
using framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa
{
    public class JogadorParaLiga : IEntity
    {
        public string NomeDaEntidade => "Liga para participação";
        public Genero GeneroDaEntidade => Genero.Masculino;

        public long Id { get; set; }
        public long IdDaLiga { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Celular { get; set; }
        public Tipo<SituacaoDeParticipacaoEmLiga> Situacao { get; set; }
        public DateTime DataDaSituacao { get; set; }
    }
}