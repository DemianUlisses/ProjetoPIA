using data;
using framework.Validators;
using System.Text;

namespace ojogodabolsa
{
    public class Parametro : ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Parâmetro";
        public Genero GeneroDaEntidade => Genero.Masculino;
        [RequiredValidation("Informe o nome do parâmetro.")]
        public int Grupo { get; set; }
        public int Ordem { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Valor { get; set; }
        public bool Protegido { get; set; }


        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Nome);
            result.Append(Descricao);
            return SearchableBuilder.Build(result.ToString());
        }
    }
}
