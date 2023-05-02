using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class CidadeMap: ClassMap<Cidade>
    {
        public CidadeMap()
        {
            Table("cidade");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Not.Nullable().Length(100);
            References(p => p.Estado).Column("id_estado").Not.Nullable()
                .ForeignKey("fk_cidade_estado");
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_cidade_searchable");
        }
    }
}
