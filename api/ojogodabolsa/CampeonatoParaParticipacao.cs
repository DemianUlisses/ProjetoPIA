using data;
using framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa
{
    public class CampeonatoParaParticipacao: IEntity
    {
        public string NomeDaEntidade => "Campeonato para participação";
        public Genero GeneroDaEntidade => Genero.Feminino;

        public long Id { get; set; }
        public string Foto { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public long IdDoJogador { get; set; }
        public Tipo<SituacaoDeParticipacaoEmCampeonato> Situacao { get; set; }
        public DateTime DataDaSituacao { get; set; }
        public bool NecessitaAutorizacao { get; set; }
        public DateTime DataLimiteParaIngressoNoCampeonato { get; set; }
    }
}