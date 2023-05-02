using FluentNHibernate.Mapping;
using ojogodabolsa;

namespace config.NHibernate
{
    public class PalpiteDeLigaMap : ClassMap<PalpiteDeLiga>
    {
        public PalpiteDeLigaMap()
        {
            Table("palpite_de_liga");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            References(p => p.Palpite).Column("id_palpite").Not.Nullable()
                .ForeignKey("fk_palpite_de_liga_palpite");
            References(p => p.Liga).Column("id_liga").Not.Nullable()
                .ForeignKey("fk_palpite_de_liga_liga");
        }
    }
}
