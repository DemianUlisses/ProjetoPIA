using ojogodabolsa;
using data.Extensions;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class EnderecoDePessoaMap: ClassMap<EnderecoDePessoa>
    {
        public EnderecoDePessoaMap()
        {
            Table("endereco_pessoa");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            References(p => p.Pessoa).Column("id_pessoa").Not.Nullable();
            References(p => p.Endereco).Column("id_endereco").Not.Nullable()
                .Cascade.All();
            Map(p => p.Tipo).Column("tipo").CustomType<IntToTipoType<TipoDeEndereco>>()
                .Check(Enum<TipoDeEndereco>.GetDatabaseCheckConstraint("tipo"));
        }
    }
}
