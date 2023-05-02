using data;
using System;
using System.Collections.Generic;
using System.Text;

namespace ojogodabolsa
{
    public class Arquivo : IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Arquivo";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public string Tipo { get; set; }
        public string Nome { get; set; }
    }
}
