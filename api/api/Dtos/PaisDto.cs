using ojogodabolsa;
using System;

namespace api.Dtos
{
    public class FeriadoDto
    {
        public long Id { get; set; }
        public string Descricao { get; set; }
        public DateTime Data { get; set; }

        public static FeriadoDto Build(Feriado item)
        {
            if (item == null)
            {
                return null;
            }
            var result = new FeriadoDto()
            {
                Id = item.Id,
                Descricao = item.Descricao,
                Data = item.Data,
            };
            return result;
        }
    }
}
