using FluentNHibernate.Mapping;
using ojogodabolsa;

namespace config.NHibernate
{
    public class PalpiteDeCampeonatoMap : ClassMap<PalpiteDeCampeonato>
    {
        public PalpiteDeCampeonatoMap()
        {
            Table("palpite_de_campeonato");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            References(p => p.Palpite).Column("id_palpite").Not.Nullable()
                .ForeignKey("fk_palpite_de_campeonato_palpite");
            References(p => p.Campeonato).Column("id_campeonato").Not.Nullable()
                .ForeignKey("fk_palpite_de_campeonato_campeonato");
        }
    }
}
