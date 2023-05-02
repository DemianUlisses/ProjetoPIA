using data;

namespace ojogodabolsa
{
    public class PalpiteDeLiga : IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Palpite de liga";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public Palpite Palpite { get; set; }
        public Liga Liga { get; set; }
    }
}
