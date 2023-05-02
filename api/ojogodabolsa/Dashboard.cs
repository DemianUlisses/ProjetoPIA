using data;
using framework;
using framework.Validators;
using System;
using System.ComponentModel;
using System.Text;

namespace ojogodabolsa
{
    public enum SituacaoDeDashboard
    {
        [Description("Não definido")]
        NaoDefinido = 0,
        [Description("Ativa")]
        Ativo = 1,
        [Description("Inativa")]
        Inativo = 2,
    }

    public class Dashboard: ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Dashboard";
        public Genero GeneroDaEntidade => Genero.Masculino;
        [RequiredValidation("Informe o título.")]
        public string Titulo { get; set; }
        public string Detalhes { get; set; }
        [RequiredValidation("Informe uma imagem.")]
        public Arquivo Imagem { get; set; }
        [RequiredValidation("Informe a situação.")]
        public Tipo<SituacaoDeDashboard> Situacao { get; set; }
        [RequiredValidation("Informe a semana.")]
        public Semana Semana { get; set; }
        [RequiredValidation("Informe a data de publicação.")]
        public DateTime DataParaPublicacao { get; set; }
        [RequiredValidation("Informe a hora de publicação.")]
        public TimeSpan HoraParaPublicacao { get; set; }
        public DateTime? DataParaArquivamento { get; set; }

        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Titulo);
            result.Append(Detalhes);
            return SearchableBuilder.Build(result.ToString());
        }
    }
}
