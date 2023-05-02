using data;
using framework;
using System.Collections.Generic;

namespace ojogodabolsa
{
    public class EnderecoDePessoa: IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Endereço";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public Pessoa Pessoa { get; set; }
        public Endereco Endereco { get; set; }
        public Tipo<TipoDeEndereco> Tipo { get; set; }
    }

    internal class EnderecoDePessoaEqualityComparer : IEqualityComparer<EnderecoDePessoa>
    {
        public bool Equals(EnderecoDePessoa x, EnderecoDePessoa y)
        {
            return (x.Id == y.Id);
        }

        public int GetHashCode(EnderecoDePessoa obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}