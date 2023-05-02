using data;

namespace ojogodabolsa
{
    public class PalpiteDeCampeonato : IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Palpite de campeonato";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public Palpite Palpite { get; set; }
        public Campeonato Campeonato { get; set; }
    }
}
