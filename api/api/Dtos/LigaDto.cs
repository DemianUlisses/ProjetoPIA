using ojogodabolsa;
using framework;
using System;
using System.Linq;

namespace api.Dtos
{
    public class LigaDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public Tipo<TipoDeLiga> TipoDeLiga { get; set; }
        public Tipo<SituacaoDeLiga> Situacao { get; set; }
        public ArquivoDto Foto { get; set; }

        public static LigaDto Build(Liga item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new LigaDto()
            {
                Id = item.Id,
                Nome = item.Nome,
                Descricao = item.Descricao,
                Situacao = item.Situacao,
                TipoDeLiga = item.TipoDeLiga,
                Foto = ArquivoDto.Build(item.Foto)
            };
            return result;
        }
    }
}
