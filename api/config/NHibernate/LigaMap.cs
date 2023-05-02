using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class LigaMap: ClassMap<Liga>
    {
        public LigaMap()
        {
            Table("liga");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Length(30).Not.Nullable();
            Map(p => p.DataDeCadastro).Column("data_cadastro").Not.Nullable();
            Map(p => p.NecessitaAutorizacao).Column("necessita_autorizacao").Not.Nullable().Default("true");
            Map(p => p.LimiteDeParticipantes).Column("limite_de_participantes").Nullable();
            Map(p => p.Descricao).Column("descricao").Length(200).Not.Nullable();
            References(p => p.Foto).Column("id_foto").Not.Nullable()
                .ForeignKey("fk_liga_foto");
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_liga_searchable");
            Map(p => p.TipoDeLiga).Column("tipo").CustomType<IntToTipoType<TipoDeLiga>>().Default("0")
                .Check(Enum<TipoDeLiga>.GetDatabaseCheckConstraint("tipo"));
            Map(p => p.Situacao).Column("situacao").CustomType<IntToTipoType<SituacaoDeLiga>>().Default("0")
                .Check(Enum<SituacaoDeLiga>.GetDatabaseCheckConstraint("situacao"));
        }
    }
}
