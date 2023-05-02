using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config
{
    public class RotinaDoSistemaMap: ClassMap<RotinaDoSistema>
    {
        public RotinaDoSistemaMap()
        {
            Table("rotina");
            Id(p => p.Id).Column("id").GeneratedBy.Assigned();
            Map(p => p.Descricao).Column("descricao").Not.Nullable();
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_rotina_searchable");
        }
    }
}
