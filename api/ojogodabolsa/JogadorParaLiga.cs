using data;
using framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa
{
    public class JogadorParaCampeonato : IEntity
    {
        public string NomeDaEntidade => "Campeonato para participação";
        public Genero GeneroDaEntidade => Genero.Masculino;

        public long Id { get; set; }
        public long IdDoCampeonato { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Celular { get; set; }
        public Tipo<SituacaoDeParticipacaoEmCampeonato> Situacao { get; set; }
        public DateTime DataDaSituacao { get; set; }
    }
}