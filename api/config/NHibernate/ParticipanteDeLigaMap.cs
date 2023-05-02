using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class ParticipanteDeLigaMap : ClassMap<ParticipanteDeLiga>
    {
        public ParticipanteDeLigaMap()
        {
            Table("participante_de_liga");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.DataDaSituacao).Column("data_situacao").Not.Nullable();
            Map(p => p.Situacao).Column("situacao").CustomType<IntToTipoType<SituacaoDeParticipacaoEmLiga>>().Default("0")
                .Check(Enum<SituacaoDeParticipacaoEmLiga>.GetDatabaseCheckConstraint("situacao"));
            References(p => p.Liga).Column("id_liga").Not.Nullable()
                .ForeignKey("fk_participante_de_liga_liga");
            References(p => p.Jogador).Column("id_jogador").Not.Nullable()
                .ForeignKey("fk_participante_de_liga_jogador");

        }
    }
}
