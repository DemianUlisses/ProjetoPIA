using data;
using System.Collections.Generic;

namespace ojogodabolsa
{
    public class Estado: IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Estado";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public string UF { get; set; }
        public string Nome {get;set;}
        public Pais Pais { get; set; }
        public int CodigoIbge { get; set; }
    }
}