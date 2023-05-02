using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class GanhadoresMap : ClassMap<Ganhadores>
    {
        public GanhadoresMap()
        {
            Table("ganhadores");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Titulo).Column("titulo").Length(300);
            Map(p => p.Detalhes).Column("detalhe").Length(3000);
            Map(p => p.DataDeInclusao).Column("data_inclusao").Not.Nullable();
            Map(p => p.MinutosAAguardarAntesDeNotificarOsGanhadores)
                .Column("minutos_antes_de_notificar_ganhadores").Not.Nullable().Default("0");
            References(p => p.Semana).Column("id_semana").Not.Nullable()
                .ForeignKey("fk_ganhadores_semana");
            References(p => p.Imagem).Column("id_imagem") 
                .ForeignKey("fk_ganhadores_semana");
            References(p => p.Ganhador1).Column("id_jogador_1") 
                .ForeignKey("fk_jogador_1");
            References(p => p.Ganhador2).Column("id_jogador_2") 
                .ForeignKey("fk_jogador_2");
            References(p => p.Ganhador3).Column("id_jogador_3") 
                .ForeignKey("fk_jogador_3");
            References(p => p.Ultimo).Column("id_jogador_ultimo")
                .ForeignKey("fk_jogador_ultimo");
        }
    }
}
