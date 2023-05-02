using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class CampeonatoMap: ClassMap<Campeonato>
    {
        public CampeonatoMap()
        {
            Table("campeonato");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Length(30).Not.Nullable();
            Map(p => p.DataDeCadastro).Column("data_cadastro").Not.Nullable();
            Map(p => p.NecessitaAutorizacao).Column("necessita_autorizacao").Not.Nullable().Default("true");
            Map(p => p.QuantidadeDeParticipantes).Column("quantidade_de_participantes").Not.Nullable();
            Map(p => p.DataLimiteParaIngressoNoCampeonato).Column("data_limite_para_ingresso_no_campeonato").Not.Nullable();
            Map(p => p.DataInicial).Column("data_inicial").Not.Nullable();
            Map(p => p.DataFinal).Column("data_final").Not.Nullable();
            Map(p => p.Descricao).Column("descricao").Length(200).Not.Nullable();
            References(p => p.Foto).Column("id_foto").Not.Nullable()
                .ForeignKey("fk_campeonato_foto");
            References(p => p.Liga).Column("id_liga")
                .ForeignKey("fk_campeonato_liga");
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_campeonato_searchable");
            Map(p => p.TipoDeCampeonato).Column("tipo").CustomType<IntToTipoType<TipoDeCampeonato>>().Default("0")
                .Check(Enum<TipoDeCampeonato>.GetDatabaseCheckConstraint("tipo"));
            Map(p => p.Situacao).Column("situacao").CustomType<IntToTipoType<SituacaoDeCampeonato>>().Default("0")
                .Check(Enum<SituacaoDeCampeonato>.GetDatabaseCheckConstraint("situacao"));
        }
    }
}
