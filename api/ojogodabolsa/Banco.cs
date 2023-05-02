using data;
using System.Text;

namespace ojogodabolsa
{
    public class Banco : ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Banco";
        public Genero GeneroDaEntidade => Genero.Feminino;
        public string Nome { get; set; }
        public string Numero { get; set; }
        public string Digito { get; set; }

        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Nome);
            return SearchableBuilder.Build(result.ToString());
        }
    }
}
