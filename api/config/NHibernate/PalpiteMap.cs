using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class PalpiteMap: ClassMap<Palpite>
    {
        public PalpiteMap()
        {
            Table("palpite");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.DataDeInclusao).Column("data_inclusao").Not.Nullable();
            References(p => p.Semana).Column("id_semana").Not.Nullable()
                .ForeignKey("fk_palpite_semana");
            References(p => p.Jogador).Column("id_jogador").Not.Nullable()
                .ForeignKey("fk_palpite_jogador");
            References(p => p.Acao1).Column("acao_1").Not.Nullable()
                .ForeignKey("fk_palpite_acao_1");
            References(p => p.Acao2).Column("acao_2").Not.Nullable()
                .ForeignKey("fk_palpite_acao_2");
            References(p => p.Acao3).Column("acao_3").Not.Nullable()
                .ForeignKey("fk_palpite_acao_3");
            References(p => p.Acao4).Column("acao_4").Not.Nullable()
                .ForeignKey("fk_palpite_acao_4");
            References(p => p.Acao5).Column("acao_5").Not.Nullable()
                .ForeignKey("fk_palpite_acao_5");
            References(p => p.PiorAcao).Column("pior_acao").Not.Nullable()
                .ForeignKey("fk_palpite_pior_acao");
        }
    }
}
