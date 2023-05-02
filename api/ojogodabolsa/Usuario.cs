using data;
using framework;
using System.Collections.Generic;
using System.ComponentModel;
using framework.Validators;
using System.Text;

namespace ojogodabolsa
{
    public enum TipoDeUsuario
    {
        [Description("Não definido")]
        NaoDefinido = 0,

        [Description("Operador")]
        Operador = 1,

        [Description("Jogador")]
        Jogador = 2,

        [Description("Master")]
        Master = 100,
    }

    public enum SituacaoDeUsuario
    {
        [Description("Não definido")]
        NaoDefinido = 0,
        [Description("Ativo")]
        Ativo = 1,
        [Description("Inativo")]
        Inativo = 2,
    }

    public class Usuario : ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Usuário";
        public Genero GeneroDaEntidade => Genero.Feminino;
        [RequiredValidation("Informe o nome da pessoa.")]
        public string Nome { get; set; }
        [RequiredValidation("Informe o nome de usuário para acesso ao sistema.")]
        public string NomeDeUsuario { get; set; }
        [RequiredValidation("Informe a senha para acesso ao sistema.")]
        public string Senha { get; set; }
        [RequiredValidation("Informe o tipo de usuário.")]
        public Tipo<TipoDeUsuario> TipoDeUsuario { get; set; }
        [RequiredValidation("Informe o perfil de usuário.")]
        public PerfilDeUsuario Perfil { get; set; }
        [RequiredValidation("Informe a situação do usuário.")]
        public Tipo<SituacaoDeUsuario> Situacao { get; set; }
        public string PushToken { get; set; }
        public string Searchable { get; set; }
        public string LastValiTokenUID { get; set; }

        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Nome);
            result.Append(NomeDeUsuario);
            return SearchableBuilder.Build(result.ToString());
        }
    }
}
