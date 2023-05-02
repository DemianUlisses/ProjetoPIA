using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class ParametroMap: ClassMap<Parametro>
    {
        public ParametroMap()
        {
            Table("parametro");
            Id(i => i.Id).Column("id").GeneratedBy.Identity();
            Map(i => i.Grupo).Column("id_grupo").Not.Nullable();
            Map(i => i.Ordem).Column("ordem").Not.Nullable();
            Map(i => i.Nome).Column("nome").Not.Nullable().Length(50);
            Map(i => i.Descricao).Column("descricao").Not.Nullable().Length(255);
            Map(i => i.Valor).Column("valor").Length(1000);
            Map(i => i.Protegido).Column("protegido");
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_parametro_searchable");
        }
    }
}
