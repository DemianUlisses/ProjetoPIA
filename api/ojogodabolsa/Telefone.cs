using data;
using framework;
using System.Collections.Generic;

namespace ojogodabolsa
{
    public enum TipoDeTelefone
    {
        NaoDefinido = 0,
        Celular = 1,
        Residencial = 2,
        Comercial = 3,
    }

    public class Telefone
    {
        public string Pais { get; set; }
        public int DDD { get; set; }
        public string Numero { get; set; }
        public bool TemWhatsApp { get; set; }
        public Tipo<TipoDeTelefone> Tipo { get; set; }

        public Telefone()
        {

        }

        public Telefone(string numeroComMascara)
        {
            if (!string.IsNullOrEmpty(numeroComMascara))
            {
                var numero = numeroComMascara.Replace("(", string.Empty).Replace(")", string.Empty).Replace("-", string.Empty);
                DDD = int.Parse(numero.Substring(0, 2));
                Numero = (numero.Substring(2, numero.Length - 2));
                TemWhatsApp = false;
                Pais = "+55";
            }
        }
    }

    public class TelefoneDePessoa: Telefone, IEntity
    {
        public long Id { get; set; }
        public string NomeDaEntidade => "Telefone";
        public Genero GeneroDaEntidade => Genero.Masculino;
        public Pessoa Pessoa { get; set; }

        public string NumeroComDDD
        {
            get
            {
                return this.DDD > 0 && !string.IsNullOrWhiteSpace(Numero) ? string.Format(
                    "({0}){1}",
                    this.DDD.ToString("00"),
                    this.GetNumeroComDigito()) : null;
            }
        }

        public TelefoneDePessoa()
        {
            Pais = "+55";
            Tipo = TipoDeTelefone.NaoDefinido;
        }

        private string GetNumeroComDigito()
        {
            if (this.Numero.Length == 8)
            {
                return $"{this.Numero.Substring(0, 4)}-{this.Numero.Substring(4, 4)}";
            }
            else
            if (this.Numero.Length == 9)
            {
                return $"{this.Numero.Substring(0, 5)}-{this.Numero.Substring(5, 4)}";
            }
            else
            {
                return this.Numero;
            }
        }
    }

    internal class TelefoneEqualityComparer : IEqualityComparer<TelefoneDePessoa>
    {
        public bool Equals(TelefoneDePessoa x, TelefoneDePessoa y)
        {
            return (x.Pessoa.Id == y.Pessoa.Id) && (x.DDD == y.DDD) && (x.Numero == y.Numero);
        }

        public int GetHashCode(TelefoneDePessoa obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}
