using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class PaisMap: ClassMap<Pais>
    {
        public PaisMap()
        {
            Table("pais");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Length(50).Not.Nullable().Unique();
        }
    }
}
