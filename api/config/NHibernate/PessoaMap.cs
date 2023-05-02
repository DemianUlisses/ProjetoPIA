using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class PessoaMap : ClassMap<Pessoa>
    {
        public PessoaMap()
        {
            Table("pessoa");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();

            Component(p => p.Nome, m =>
            {
                m.Map(p => p.PrimeiroNome).Column("primeiro_nome").Length(50);
                m.Map(p => p.NomeDoMeio).Column("nome_do_meio").Length(100);
                m.Map(p => p.UltimoNome).Column("ultimo_nome").Length(50);
            });

            Map(p => p.NomeCompleto).Column("nome_completo").Length(200);
            Map(p => p.Apelido).Column("Apelido").Length(20);
            Map(p => p.RazaoSocial).Column("razao_social").Length(200);
            Map(p => p.NomeFantasia).Column("nome_fantasia").Length(200);
            Map(p => p.DataDeCadastro).Column("data_cadastro").Not.Nullable();
            Map(p => p.Searchable).Column("searchable").Length(500).Index("idx_pessoa_searchable");

            Map(p => p.Sexo).Column("sexo").CustomType<IntToTipoType<Sexo>>().Not.Nullable().Default("0")
                .Check(Enum<Sexo>.GetDatabaseCheckConstraint("sexo"));
            HasMany(p => p.Enderecos).KeyColumn("id_pessoa")                
                .Cascade.All()
                .ForeignKeyConstraintName("fk_endereco_pessoa")
                .Inverse();
            HasMany(p => p.Telefones).KeyColumn("id_pessoa")
                .ForeignKeyCascadeOnDelete()
                .Cascade.All()
                .ForeignKeyConstraintName("fk_telefone_pessoa")
                .Inverse()
                .OrderBy("tipo");
            Map(p => p.TipoDePessoa).Column("tipo_pessoa").CustomType<IntToTipoType<TipoDePessoa>>()
                .Not.Nullable().Default("1")
                .Check(Enum<TipoDePessoa>.GetDatabaseCheckConstraint("tipo_pessoa"));
            Map(p => p.DocumentoDeIdentidade).Column("documento_identidade").Length(20);
            Map(p => p.OrgaoExpedidorDoDocumentoDeIdentidade).Column("orgao_expedidor_documento_identidade").Length(20);
            Map(p => p.Cpf).Column("cpf").Length(14);
            Map(p => p.Cnpj).Column("cnpj").Length(18);
            Map(p => p.Email).Column("email").Length(100);
            References(p => p.Usuario)
                .Column("id_usuario")
                .ForeignKey("fk_pessoa_usuario");
            References(p => p.Foto).Column("id_foto")
                .ForeignKey("fk_pessoa_foto");
            Map(p => p.DataDeNascimento).Column("data_nascimento");
        }
    }
}
