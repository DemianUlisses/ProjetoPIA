using ojogodabolsa;
using framework;
using System;
using System.Linq;

namespace api.Dtos
{
    public class CampeonatoDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public Tipo<TipoDeCampeonato> TipoDeCampeonato { get; set; }
        public Tipo<SituacaoDeCampeonato> Situacao { get; set; }
        public ArquivoDto Foto { get; set; }

        public static CampeonatoDto Build(Campeonato item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new CampeonatoDto()
            {
                Id = item.Id,
                Nome = item.Nome,
                Descricao = item.Descricao,
                Situacao = item.Situacao,
                TipoDeCampeonato = item.TipoDeCampeonato,
                Foto = ArquivoDto.Build(item.Foto)
            };
            return result;
        }
    }
}
