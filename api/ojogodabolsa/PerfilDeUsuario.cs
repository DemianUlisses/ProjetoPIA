using data;
using framework;
using framework.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace ojogodabolsa
{
    public enum SituacaoDePerfilDeUsuario
    {
        [Description("Não definido")]
        NaoDefinido = 0,
        [Description("Ativo")]
        Ativo = 1,
        [Description("Inativo")]
        Inativo = 2,
    }

    public class PerfilDeUsuario : ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Perfil de usuário";
        public Genero GeneroDaEntidade => Genero.Masculino;
        [RequiredValidation("Informe o nome do perfil de usuário.")]
        public string Nome { get; set; }
        [RequiredValidation("Informe a situação do perfil de usuário.")]
        public Tipo<SituacaoDePerfilDeUsuario> Situacao { get; set; }
        public IEnumerable<AcessoDePerfilDeUsuario> Acessos { get; set; }
        public bool PerfilPadraoParaCadastroDeJogador { get; set; }

        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Nome);
            return SearchableBuilder.Build(result.ToString());
        }
    }
}
