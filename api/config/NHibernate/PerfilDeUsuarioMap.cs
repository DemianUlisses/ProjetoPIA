using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Text;

namespace config.NHibernate
{
    public class PerfilDeUsuarioMap: ClassMap<PerfilDeUsuario>
    {
        public PerfilDeUsuarioMap()
        {
            Table("perfil_usuario");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Nome).Column("nome").Not.Nullable().Length(100);
            Map(p => p.PerfilPadraoParaCadastroDeJogador).Column("padrao_novo_jogador").Default("false");
            Map(p => p.Situacao).Column("situacao").CustomType<IntToTipoType<SituacaoDePerfilDeUsuario>>().Not.Nullable()
                .Check(Enum<SituacaoDePerfilDeUsuario>.GetDatabaseCheckConstraint("situacao"));
            HasMany(p => p.Acessos)
                .KeyColumn("id_perfil_usuario")
                .Cascade.All()
                .ForeignKeyConstraintName("none")
                .Inverse()
                .OrderBy("id_rotina");
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_perfil_usuario_searchable");
        }
    }
}
