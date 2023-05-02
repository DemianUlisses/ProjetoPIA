using ojogodabolsa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos
{
    public class ArquivoDto
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Tipo { get; set; }

        public static ArquivoDto Build(Arquivo item)
        {
            var result = default(ArquivoDto);
            if (item != null)
            {
                result = new ArquivoDto()
                {
                    Id = item.Id,
                    Nome = item.Nome,
                    Tipo = item.Tipo,
                };
            }
            return result;
        }
    }
}
