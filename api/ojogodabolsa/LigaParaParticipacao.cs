using data;
using framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa
{
    public class LigaParaParticipacao: IEntity
    {
        public string NomeDaEntidade => "Liga para participação";
        public Genero GeneroDaEntidade => Genero.Feminino;

        public long Id { get; set; }
        public string Foto { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public long IdDoJogador { get; set; }
        public Tipo<SituacaoDeParticipacaoEmLiga> Situacao { get; set; }
        public DateTime DataDaSituacao { get; set; }
        public bool NecessitaAutorizacao { get; set; }
    }
}