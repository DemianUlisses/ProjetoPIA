using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class ParticipanteDeCampeonatoMap : ClassMap<ParticipanteDeCampeonato>
    {
        public ParticipanteDeCampeonatoMap()
        {
            Table("participante_de_campeonato");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.DataDaSituacao).Column("data_situacao").Not.Nullable();
            Map(p => p.Situacao).Column("situacao").CustomType<IntToTipoType<SituacaoDeParticipacaoEmCampeonato>>().Default("0")
                .Check(Enum<SituacaoDeParticipacaoEmCampeonato>.GetDatabaseCheckConstraint("situacao"));
            References(p => p.Campeonato).Column("id_campeonato").Not.Nullable()
                .ForeignKey("fk_participante_de_campeonato_campeonato");
            References(p => p.Jogador).Column("id_jogador").Not.Nullable()
                .ForeignKey("fk_participante_de_campeonato_jogador");

        }
    }
}
