using ojogodabolsa;
using config.NHibernate;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config
{
    public class DashboardMap: ClassMap<Dashboard>
    {
        public DashboardMap()
        {
            Table("dashboard");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Titulo).Column("titulo").Length(300);
            Map(p => p.Detalhes).Column("detalhe").Length(2000);
            Map(p => p.DataParaPublicacao).Column("data_publicacao");
            Map(p => p.HoraParaPublicacao).Column("hora_publicacao");
            Map(p => p.DataParaArquivamento).Column("data_arquivamento");
            References(p => p.Imagem).Column("id_imagem")
                .ForeignKey("fk_dashboard_imagem");
            Map(p => p.Situacao).Column("situacao").CustomType<IntToTipoType<SituacaoDeDashboard>>().Not.Nullable()
                .Check(Enum<SituacaoDeDashboard>.GetDatabaseCheckConstraint("situacao"));
            References(p => p.Semana).Column("id_semana")
                .ForeignKey("fk_dashboard_semana");
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_dashboard_searchable");
        }
    }
}
