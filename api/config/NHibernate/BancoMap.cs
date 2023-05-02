using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class BancoMap: ClassMap<Banco>
    {
        public BancoMap()
        {
            Table("banco");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Not.Nullable().Length(100);
            Map(p => p.Numero).Column("numero").Not.Nullable().Length(3);
            Map(p => p.Digito).Column("digito").Length(1);
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_banco_searchable");
        }
    }
}
