using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class FeriadoMap : ClassMap<Feriado>
    {
        public FeriadoMap()
        {
            Table("feriado");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Data).Column("data").Not.Nullable();
            Map(p => p.Descricao).Column("descricao").Not.Nullable().Length(300);
            Map(p => p.Nacional).Column("nacional").Not.Nullable();
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_feriado_searchable");
        }
    }
}
