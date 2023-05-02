using data;
using framework.Validators;
using System;

namespace ojogodabolsa
{
    public class Ganhadores: IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Ganhadores";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public DateTime DataDeInclusao { get; set; }
        public string Titulo { get; set; }
        public string Detalhes { get; set; }
        [RequiredValidation("Semana deve ser informada.")]
        public Semana Semana { get; set; }
        public Jogador Ganhador1 { get; set; }
        public Jogador Ganhador2 { get; set; }
        public Jogador Ganhador3 { get; set; }
        public Jogador Ultimo { get; set; }
        public Arquivo Imagem { get; set; }
        public int? MinutosAAguardarAntesDeNotificarOsGanhadores { get; set; }
    }
}