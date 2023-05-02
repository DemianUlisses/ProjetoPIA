using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class SemanaMap : ClassMap<Semana>
    {
        public SemanaMap()
        {
            Table("semana");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_semana_searchable");
            Map(p => p.Ano).Column("ano").Not.Nullable();
            Map(p => p.Numero).Column("numero").Not.Nullable();
            Map(p => p.Nome).Column("nome").Not.Nullable().Length(50);
            Map(p => p.Descricao).Column("descricao").Length(300);
            Map(p => p.DataIncialDaApuracao).Column("data_inicial_apuracao").Not.Nullable();
            Map(p => p.DataFinalDaApuracao).Column("data_final_apuracao").Not.Nullable();
            Map(p => p.HoraDeAberturaDosJogos).Column("hora_abertura").Not.Nullable();
            Map(p => p.HoraDeFechamentoDosJogos).Column("hora_fechamento").Not.Nullable();
            Map(p => p.DataDeAberturaDosJogos).Column("data_abertura").Not.Nullable();
            Map(p => p.DataDeFechamentoDosJogos).Column("data_fechamento").Not.Nullable();
            Map(p => p.EmailDeAberturaEnviado).Column("email_de_abertura_dos_jogos_enviado").Not.Nullable().Default("false");
            Map(p => p.EmailDeFechamentoEnviado).Column("email_de_fechamento_dos_jogos_enviado").Not.Nullable().Default("false");
        }
    }
}
