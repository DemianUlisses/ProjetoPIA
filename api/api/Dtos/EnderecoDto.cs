using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ojogodabolsa;
using framework;

namespace api.Dtos
{
    public class EnderecoDto
    {
        public string Logradouro { get; set; }
        public string Numero { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string CEP { get; set; }
        public CidadeDto Cidade { get; set; }

        public static EnderecoDto Build(Endereco item)
        {
            var result = default(EnderecoDto);
            if (item != null)
            {
                result = new EnderecoDto()
                {
                    Bairro = item.Bairro,
                    CEP = item.CEP,
                    Cidade = CidadeDto.Build(item.Cidade),
                    Complemento = item.Complemento,
                    Logradouro = item.Logradouro,
                    Numero = item.Numero,
                };
            }
            return result;
        }
    }

    public class EnderecoDePessoaDto
    {
        public long Id { get; set; }
        public long IdDaPessoa { get; set; }
        public Tipo<TipoDeEndereco> Tipo { get; set; }
        public EnderecoDto Endereco { get; set; }

        public static EnderecoDePessoaDto Build(EnderecoDePessoa item)
        {
            var result = default(EnderecoDePessoaDto);
            if (item != null)
            {
                result = new EnderecoDePessoaDto()
                {
                    Id = item.Id,
                    IdDaPessoa = item.Pessoa.Id,
                    Endereco = EnderecoDto.Build(item.Endereco),
                    Tipo = item.Tipo,
                };
            }
            return result;
        }
    }   
}