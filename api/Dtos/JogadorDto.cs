using ojogodabolsa;
using framework;
using System;
using System.Linq;

namespace api.Dtos
{
    public class JogadorDto
    {
        public long Id { get; set; }
        public NomeDePessoa Nome { get; set; }
        public string NomeCompleto { get; set; }
        public DateTime? DataDeNascimento { get; set; }
        public string Cpf { get; set; }
        public string DocumentoDeIdentidade { get; set; }
        public string OrgaoExpedidorDoDocumentoDeIdentidade { get; set; }
        public string Email { get; set; }
        public EnderecoDePessoaDto[] Enderecos { get; set; }
        public ArquivoDto Foto { get; set; }
        public string IdadePorExtenso { get; set; }
        public Tipo<Sexo> Sexo { get; set; }
        public TelefoneDto[] Telefones { get; set; }
        public Tipo<TipoDePessoa> TipoDePessoa { get; set; }
        public UsuarioDto Usuario { get; set; }
        public int Idade { get; set; }
        public static JogadorDto Build(Jogador item)
        {
            var result = default(JogadorDto);
            if (item != null)
            {
                result = new JogadorDto()
                {
                    Id = item.Id,
                    DataDeNascimento = item.DataDeNascimento,
                    Cpf = item.Cpf,
                    DocumentoDeIdentidade = item.DocumentoDeIdentidade,
                    OrgaoExpedidorDoDocumentoDeIdentidade = item.OrgaoExpedidorDoDocumentoDeIdentidade,
                    Email = item.Email,
                    Enderecos = item.Enderecos.Select(i => EnderecoDePessoaDto.Build(i)).ToArray(),
                    Foto = ArquivoDto.Build(item.Foto),
                    IdadePorExtenso = item.IdadePorExtenso,
                    Idade = item.Idade,
                    Nome = item.Nome,
                    NomeCompleto = item.NomeCompleto,
                    Sexo = item.Sexo,
                    Telefones = item.Telefones.Select(i => TelefoneDto.Build(i)).ToArray(),
                    TipoDePessoa = item.TipoDePessoa,
                    Usuario = UsuarioDto.Build(item.Usuario)
                };
            }
            return result;
        }
    }

    public class JogadorSimplesDto
    {
        public long Id { get; set; }
        public string NomeCompleto { get; set; }
        public ArquivoDto Foto { get; set; }
        public string IdadePorExtenso { get; set; }
        public int Idade { get; set; }
        public Tipo<Sexo> Sexo { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }

        public static JogadorSimplesDto Build(Jogador item)
        {
            var result = default(JogadorSimplesDto);
            if (item != null)
            {
                result = new JogadorSimplesDto()
                {
                    Id = item.Id,
                    Foto = ArquivoDto.Build(item.Foto),
                    IdadePorExtenso = item.IdadePorExtenso,
                    Idade = item.Idade,
                    NomeCompleto = item.NomeCompleto,
                    Sexo = item.Sexo,
                    Email = item.Email,
                    Telefone = item.GetTelefonePrincipal(),
                    Cpf = item.Cpf
                };
            }
            return result;
        }
    }

    public class JogadorSimplesComDadosBancariosDto
    {
        public long Id { get; set; }
        public string NomeCompleto { get; set; }
        public ArquivoDto Foto { get; set; }
        public string IdadePorExtenso { get; set; }
        public int Idade { get; set; }
        public Tipo<Sexo> Sexo { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Cpf { get; set; }
        public virtual BancoDto Banco { get; set; }
        public virtual string AgenciaDaContaCorrente { get; set; }
        public virtual string NumeroDaContaCorrente { get; set; }
        public virtual string DigitoDaContaCorrente { get; set; }
        public virtual Tipo<TipoDeContaBancaria> TipoDeConta { get; set; }

        public static JogadorSimplesComDadosBancariosDto Build(Jogador item)
        {
            var result = default(JogadorSimplesComDadosBancariosDto);
            if (item != null)
            {
                result = new JogadorSimplesComDadosBancariosDto()
                {
                    Id = item.Id,
                    Foto = ArquivoDto.Build(item.Foto),
                    IdadePorExtenso = item.IdadePorExtenso,
                    Idade = item.Idade,
                    NomeCompleto = item.NomeCompleto,
                    Sexo = item.Sexo,
                    Email = item.Email,
                    Telefone = item.GetTelefonePrincipal(),
                    Cpf = item.Cpf,
                    AgenciaDaContaCorrente = item.AgenciaDaContaCorrente, 
                    Banco = BancoDto.Build(item.Banco),
                    DigitoDaContaCorrente = item.DigitoDaContaCorrente, 
                    NumeroDaContaCorrente = item.NumeroDaContaCorrente, 
                    TipoDeConta = item.TipoDeConta,  
                };
            }
            return result;
        }
    }

    public class BancoDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Numero { get; set; }
        public string Digito { get; set; }

        public static BancoDto Build(Banco item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new BancoDto()
            {
                Id = item.Id,
                Numero = item.Numero,
                Nome = item.Nome,
                Digito = item.Digito,
            };
            return result;
        }
    }


}
