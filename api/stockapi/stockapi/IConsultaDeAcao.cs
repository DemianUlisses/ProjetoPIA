using System;

namespace stockapi
{
    public interface IConsultaDeAcao
    {
        ValorAtualizado GetValorAtualizado(string simbolo);
    }

    public class ValorAtualizado
    {
        public decimal? Valor { get; set; }
        public DateTime? DataDaAtualizacao { get; set; }
    }
}
