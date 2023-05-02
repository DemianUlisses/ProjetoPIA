using ojogodabolsa.Builders;
using data;
using framework;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using framework.Validators;
using System;
using System.Text;
using framework.Extensions;

namespace ojogodabolsa
{
    public enum TipoDePessoa
    {
        [Description("Não informado")]
        NaoInformado = 0,
        [Description("Física")]
        PessoaFisica = 1,
        [Description("Jurídica")]
        PessoaJuridica = 2,
    }

    public enum Sexo
    {
        [Description("Não informado")]
        NaoInformado = 0,
        [Description("Masculino")]
        Masculino = 1,
        [Description("Feminino")]
        Feminino = 2,
    }

    public class Pessoa : ISearchableEntity
    {
        public virtual long Id { get; set; }
        public virtual string NomeDaEntidade => "Pessoa";
        public virtual Genero GeneroDaEntidade => Genero.Masculino;
        public virtual string Searchable { get; set; }
        [RequiredValidation("A data de cadastro deve ser informada")]
        public virtual DateTime DataDeCadastro { get; set; }
        //[RequiredValidation("Informe um usuário para essa pessoa acessar o sistema.")]
        public virtual Usuario Usuario { get; set; }
        public virtual NomeDePessoa Nome { get; set; }
        public virtual string Apelido { get; set; }
        [CPFValidation]
        public virtual string Cpf { get; set; }
        public virtual string Cnpj { get; set; }
        public virtual string DocumentoDeIdentidade { get; set; }
        public virtual string OrgaoExpedidorDoDocumentoDeIdentidade { get; set; }
        public virtual IEnumerable<EnderecoDePessoa> Enderecos { get; set; }
        public virtual IEnumerable<TelefoneDePessoa> Telefones { get; set; }
        public virtual string Email { get; set; }
        public virtual Tipo<Sexo> Sexo { get; set; }
        public virtual Tipo<TipoDePessoa> TipoDePessoa { get; set; }
        public virtual Arquivo Foto { get; set; }
        public virtual DateTime? DataDeNascimento { get; set; }

        [RequiredValidation("Informe o nome da pessoa.", "Nome", GroupValidationType.AtLeastOneValid)]
        public virtual string NomeCompleto { get; set; }

        public virtual void SetNomeCompleto()
        {
            this.NomeCompleto = this.Nome != null ?
                string.Join(" ", this.Nome.PrimeiroNome,
                this.Nome.NomeDoMeio,
                this.Nome.UltimoNome).Replace("  ", " ") : null;
        }

        [RequiredValidation("Informe a razão social.", "Nome", GroupValidationType.AtLeastOneValid)]
        public virtual string RazaoSocial { get; set; }

        public virtual string NomeFantasia { get; set; }


        public virtual string IdadePorExtenso { get { return DataDeNascimento.ToIdadePorExtenso(); } }
        public virtual int Idade { get { return DataDeNascimento.ToIdade(); } }

        public Pessoa()
        {
            this.Sexo = 0;
            this.TipoDePessoa = 0;
        }

        public virtual string GetTelefonePrincipal()
        {
            var result = default(string);
            if (Telefones != null)
            {
                var telefone = Telefones.FirstOrDefault();
                if (telefone != null)
                {
                    result = telefone.NumeroComDDD;
                }
            }
            return result;
        }

        public virtual string GetSearchableText()
        {
            var result = new StringBuilder();
            result.Append(Email);
            if (TipoDePessoa.Is(ojogodabolsa.TipoDePessoa.PessoaJuridica))
            {
                result.Append(NomeFantasia);
                result.Append(RazaoSocial);
                result.Append(Cnpj);
            }
            else
            {
                result.Append(NomeCompleto);
                result.Append(Cpf);
            }
            result.Append(DocumentoDeIdentidade);
            if (Telefones != null)
            {
                Telefones.ForEach(telefone =>
                {
                    result.Append(telefone.NumeroComDDD);
                });
            }
            return SearchableBuilder.Build(result.ToString());
        }
    }

    public static class DateTimeExtensions
    {
        public static string ToIdadePorExtenso(this DateTime? data)
        {
            var result = default(string);
            if (data.HasValue)
            {
                DateTime DataNascimento = data.Value;
                DateTime DataAtual = DateTime.Now;
                if (DataNascimento > DataAtual)
                {
                    throw new Exception("A data de nascimento não pode ser superior a data atual.");
                }
                int Anos = new DateTime(DateTime.Now.Subtract(DataNascimento).Ticks).Year - 1;
                DateTime AnosTranscorridos = DataNascimento.AddYears(Anos);
                int Meses = 0;
                for (int i = 1; i <= 12; i++)
                {
                    if (AnosTranscorridos.AddMonths(i) == DataAtual)
                    {
                        Meses = i;
                        break;
                    }
                    else if (AnosTranscorridos.AddMonths(i) >= DataAtual)
                    {
                        Meses = i - 1;
                        break;
                    }
                }
                int Dias = DataAtual.Subtract(AnosTranscorridos.AddMonths(Meses)).Days;
                int Horas = DataAtual.Subtract(AnosTranscorridos).Hours;
                int Minutos = DataAtual.Subtract(AnosTranscorridos).Minutes;
                int Segundos = DataAtual.Subtract(AnosTranscorridos).Seconds;

                result = $"{Anos} anos {Meses} meses {Dias} dias";
            }
            return result;
        }

        public static int ToIdade(this DateTime? data)
        {
            var result = default(int);
            if (data.HasValue)
            {
                DateTime DataNascimento = data.Value;
                DateTime DataAtual = DateTime.Now;
                result = new DateTime(DateTime.Now.Subtract(DataNascimento).Ticks).Year - 1;
            }
            return result;
        }
    }


}
