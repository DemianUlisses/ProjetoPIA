using data;

namespace ojogodabolsa
{
    public class Pais: IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "País";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public string Nome { get; set; }
    }
}
