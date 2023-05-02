using data;
using framework;
using System;
using System.ComponentModel;
using System.Text;

namespace ojogodabolsa
{
    public enum TipoDeLiga
    {
        [Description("Não informado")]
        NaoInformado = 0,
        [Description("Liga do sistema")]
        LigaDoSistema = 1,
        [Description("Liga de jogador")]
        LigaDeJogador = 2,
    }

    public enum SituacaoDeLiga
    {
        [Description("Não informado")]
        NaoInformado = 0,
        [Description("Ativa")]
        Ativa = 1,
        [Description("Inativa")]
        Inativa = 2
    }

    public class Liga: ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Liga";
        public Genero GeneroDaEntidade => Genero.Feminino;

        public string Nome { get; set; }
        public string Descricao { get; set; }        
        public Tipo<TipoDeLiga> TipoDeLiga { get; set; }
        public Tipo<SituacaoDeLiga> Situacao { get; set; }
        public string Searchable { get; set; }
        public Arquivo Foto { get; set; }
        public DateTime DataDeCadastro { get; set; }
        public bool NecessitaAutorizacao { get; set; }
        public int? LimiteDeParticipantes { get; set; }

        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Nome);
            result.Append(Descricao);
            return SearchableBuilder.Build(result.ToString());
        }
    }

    public enum SituacaoDeParticipacaoEmLiga
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

    public class ParticipanteDeLiga : IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Participante de liga";
        public Genero GeneroDaEntidade => Genero.Masculino;

        public Liga Liga { get; set; }
        public Jogador Jogador { get; set; }
        public Tipo<SituacaoDeParticipacaoEmLiga> Situacao { get; set; }
        public DateTime DataDaSituacao { get; set; }
    }
}
