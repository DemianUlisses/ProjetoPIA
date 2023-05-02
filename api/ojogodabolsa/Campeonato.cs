using data;
using framework;
using System;
using System.ComponentModel;
using System.Text;

namespace ojogodabolsa
{
    public enum TipoDeCampeonato
    {
        [Description("Não informado")]
        NaoInformado = 0,
        [Description("Campeonato do sistema")]
        CampeonatoDoSistema = 1,
        [Description("Campeonato de jogador")]
        CampeonatoDeJogador = 2,
    }

    public enum SituacaoDeCampeonato
    {
        [Description("Não informado")]
        NaoInformado = 0,
        [Description("Ativo")]
        Ativa = 1,
        [Description("Inativo")]
        Inativa = 2
    }

    public class Campeonato : ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Campeonato";
        public Genero GeneroDaEntidade => Genero.Feminino;

        public string Nome { get; set; }
        public string Descricao { get; set; }        
        public Tipo<TipoDeCampeonato> TipoDeCampeonato { get; set; }
        public Tipo<SituacaoDeCampeonato> Situacao { get; set; }
        public string Searchable { get; set; }
        public Arquivo Foto { get; set; }
        public DateTime DataDeCadastro { get; set; }
        public DateTime DataInicial { get; set; }
        public DateTime DataLimiteParaIngressoNoCampeonato { get; set; }
        public DateTime DataFinal { get; set; }
        public bool NecessitaAutorizacao { get; set; }
        public int? QuantidadeDeParticipantes { get; set; }
        public Liga Liga { get; set; }

        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Nome);
            result.Append(Descricao);
            return SearchableBuilder.Build(result.ToString());
        }
    }

    public enum SituacaoDeParticipacaoEmCampeonato
    {
        [Description("Não informado")]
        NaoInformado = 0,
        [Description("Participação solicitada")]
        Solicitada = 1,
        [Description("Participando")]
        Participando = 2,
        [Description("Participação negada")]
        SolicitacaoNegada = 3,
        [Description("Saiu")]
        Saiu = 4,
        [Description("Removido")]
        Removido = 5
    }

    public class ParticipanteDeCampeonato : IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Participante de campeonato";
        public Genero GeneroDaEntidade => Genero.Masculino;

        public Campeonato Campeonato { get; set; }
        public Jogador Jogador { get; set; }
        public Tipo<SituacaoDeParticipacaoEmCampeonato> Situacao { get; set; }
        public DateTime DataDaSituacao { get; set; }
    }
}
