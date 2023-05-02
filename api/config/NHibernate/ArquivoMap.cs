using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class ArquivoMap: ClassMap<Arquivo>
    {
        public ArquivoMap()
        {
            Table("arquivo");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Not.Nullable().Length(255);
            Map(p => p.Tipo).Column("tipo").Not.Nullable().Length(20);
        }
    }
}
