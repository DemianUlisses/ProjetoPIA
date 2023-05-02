using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class EstadoMap: ClassMap<Estado>
    {
        public EstadoMap()
        {
            Table("estado");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Length(50).Not.Nullable();
            Map(p => p.UF).Column("uf").Length(2).Not.Nullable();
            Map(p => p.CodigoIbge).Column("codigo_ibge");
            References(p => p.Pais).Column("id_pais").Not.Nullable()
                .ForeignKey("fk_estado_pais");
        }
    }
}
