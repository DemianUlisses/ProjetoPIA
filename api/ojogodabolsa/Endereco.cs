using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ojogodabolsa
{
    public class Endereco
    {
        public virtual long Id { get; set; }
        public virtual string Logradouro { get; set; }
        public virtual string Numero { get; set; }
        public virtual string Complemento { get; set; }
        public virtual string Bairro { get; set; }
        public virtual string CEP { get; set; }
        public virtual Cidade Cidade { get; set; }
        public virtual string UF { get { return (Cidade?.Estado.UF); } }

        public string EnderecoCompleto { get { return this.ToEnderecoCompleto(); } }
    }

    public static class EnderecoExtensions
    {
        public static string ToEnderecoCompleto(this Endereco endereco)
        {
            var result = string.Empty;
            if (endereco !=  null)
            {
                result = string.Join(", ", new string[]
                {
                    endereco.Logradouro,
                    endereco.Numero,
                    endereco.Complemento,
                    endereco.Bairro,
                    $"CEP {endereco.CEP}", 
                    $"{endereco.Cidade.Nome} / {endereco.Cidade.Estado.UF}"
                });
                result = result.Replace(", ,", ",").Trim();
            }
            return result;
        }
    }
}
