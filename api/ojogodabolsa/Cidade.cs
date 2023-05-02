using data;
using System.Text;

namespace ojogodabolsa
{
    public class Cidade: ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Cidade";
        public Genero GeneroDaEntidade => Genero.Feminino;
        public string Nome { get; set; }
        public Estado Estado { get; set; }
        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Nome);
            return SearchableBuilder.Build(result.ToString());
        }
    }
}
