using data;
using System.Text;

namespace ojogodabolsa
{
    public class Ganhador: ISearchableEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Ação";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public string Nome { get; set; }

        public string Searchable { get; set; }
        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Nome);
            return SearchableBuilder.Build(result.ToString());
        }
    }
}