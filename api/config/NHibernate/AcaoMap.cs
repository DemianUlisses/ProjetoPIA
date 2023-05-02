using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class AcaoMap: ClassMap<Ganhador>
    {
        public AcaoMap()
        {
            Table("acao");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Length(200).Not.Nullable().Unique();
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_acao_searchable");
        }
    }
}
