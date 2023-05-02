using FluentNHibernate.Mapping;
using data.Extensions;
using ojogodabolsa;
using config.NHibernate;

namespace config
{
    public class AcessoDeUsuarioMap : ClassMap<AcessoDePerfilDeUsuario>
    {
        public AcessoDeUsuarioMap()
        {
            Table("acesso");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            References(p => p.Rotina).Column("id_rotina")
                .ForeignKey("fk_acesso_rotina")
                .Not.Nullable();
            References(p => p.PerfilDeUsuario).Column("id_perfil_usuario")
                .ForeignKey("fk_acesso_perfil_usuario")
                .Not.Nullable();
        }
    }
}
