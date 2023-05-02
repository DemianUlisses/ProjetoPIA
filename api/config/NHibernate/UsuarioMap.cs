using ojogodabolsa;
using config.NHibernate;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config
{
    public class UsuarioMap: ClassMap<Usuario>
    {
        public UsuarioMap()
        {
            Table("usuario");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Length(100).Not.Nullable();
            Map(p => p.NomeDeUsuario).Column("email").Length(100).Not.Nullable().Unique();
            Map(p => p.Senha).Column("senha").Length(100).Not.Nullable();
            Map(p => p.PushToken).Column("push_token").Length(100);
            Map(p => p.LastValiTokenUID).Column("last_valid_token_uid").Length(36);
            Map(p => p.TipoDeUsuario).Column("tipo").Not.Nullable().CustomType<IntToTipoType<TipoDeUsuario>>()
                .Check(Enum<TipoDeUsuario>.GetDatabaseCheckConstraint("tipo"));
            References(p => p.Perfil).Column("id_perfil_usuario")
                .ForeignKey("fk_usuario_perfil_usuario");
            Map(p => p.Situacao).Column("situacao").CustomType< IntToTipoType<SituacaoDeUsuario>>().Not.Nullable()
                .Check(Enum<SituacaoDeUsuario>.GetDatabaseCheckConstraint("situacao"));
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_usuario_searchable");
        }
    }
}
