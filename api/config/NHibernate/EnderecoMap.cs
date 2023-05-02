using ojogodabolsa;
using FluentNHibernate.Mapping;

namespace config.NHibernate
{
    public class EnderecoMap: ClassMap<Endereco>
    {
        public EnderecoMap()
        {
            Table("endereco");
            Id(p => p.Id).Column("id").GeneratedBy.Identity();
            Map(p => p.Logradouro).Column("logradouro").Not.Nullable();
            Map(p => p.Numero).Column("numero").Length(10).Not.Nullable();
            Map(p => p.Complemento).Column("complemento").Length(30);
            Map(p => p.Bairro).Column("bairro").Not.Nullable();
            Map(p => p.CEP).Column("cep").Not.Nullable().Length(9);
            References(p => p.Cidade).Column("id_cidade").Not.Nullable()
                .ForeignKey("fk_cidade_endereco");
        }
    }
}
